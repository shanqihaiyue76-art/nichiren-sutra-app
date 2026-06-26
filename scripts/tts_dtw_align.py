#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
手法B: TTS-DTW フォースド・アライメント（aeneas アルゴリズムの自前再実装）

aeneas パッケージは現環境(Python 3.14 / numpy 2.x)で導入不可(numpy.distutils 削除)。
そこで aeneas の中核アルゴリズムだけを numpy + stdlib + espeak-ng + ffmpeg で再実装する。

  正規経本の各句の「読み(かな)」
      └─ espeak-ng(-v ja) で音声合成（句ごと → 合成音の句境界が既知）
            └─ 合成音MFCC ↔ 実音声MFCC を サブシーケンスDTW で時間整合
                  └─ 既知の合成句境界を DTW 経路で実音声の時刻へ写像 → 各句の開始秒

Whisper も kuromoji も使わない。正規テキストの「読み」を直接、実音声へ対応づける。
依存: numpy(導入済) / espeak-ng(検証済) / ffmpeg のみ。scipy/librosa は使わない。

⚠ これは「時刻割り当て器」であり、正解(ground truth)生成器ではない。
   出力秒の真値との誤差は別途、独立に検証した基準アンカー集合に対して測ること。

使い方:
  python3 tts_dtw_align.py \
      --lines scripts/_smoke_hobenpon_excerpt.json \
      --audio .cache/_oN7QCtk3lk.16k.wav \
      --crop 185,345 \
      --out .cache/_oN7QCtk3lk.dtw.json

入力 --lines JSON 形式:
  { "lines": [ { "id": "h1", "reading": "にじせそん …" }, ... ] }

──────────────────────────────────────────────────────────────────
スモーク検証結果（2026-06-24, 方便品AIサンプル抜粋9行 / _oN7QCtk3lk crop178-345）:
  ・バンド無し → 全9句が273-286sへ退行（潰れ）。要バンド。
  ・バンド30s → 単調・分散した境界を取得（h1=208 … h9=306.6s, 4.5s）。
  ・ただしNWアンカー(ASR近似)との不一致 ±20〜45s。espeak合成音と読経の
    音響差が大きく、境界はバンド/線形に強く支配される。
  ⇒ 配管は健全。読経での絶対精度は本番(正規全文＋独立基準)で要評価。
     ※真値基準が無いため上の「不一致」は誤差ではなく手法間の相違。
──────────────────────────────────────────────────────────────────
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile
import time
import wave

import numpy as np

SR = 16000  # 実音声・合成音ともにこのレートへ揃える


# ────────────────────────────────────────────────────────────────────
# 音声入出力
# ────────────────────────────────────────────────────────────────────
def read_wav_mono16k(path):
    """16kHz mono PCM16 WAV を float32 [-1,1] で読む（stdlib wave のみ）。"""
    with wave.open(path, "rb") as w:
        ch, width, rate, n = w.getnchannels(), w.getsampwidth(), w.getframerate(), w.getnframes()
        if width != 2:
            raise ValueError(f"{path}: 16bit PCM 以外は非対応 (sampwidth={width})")
        raw = w.readframes(n)
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    if ch == 2:
        x = x.reshape(-1, 2).mean(axis=1)
    if rate != SR:
        raise ValueError(f"{path}: sample_rate={rate}, 期待 {SR}（事前に ffmpeg で変換のこと）")
    return x


def espeak_to_16k(reading, tmpdir, idx):
    """1句の読みを espeak-ng(ja) で合成し、16kHz mono float32 配列を返す。"""
    raw_wav = os.path.join(tmpdir, f"tts_{idx}_raw.wav")
    out_wav = os.path.join(tmpdir, f"tts_{idx}_16k.wav")
    # espeak-ng: 読経に寄せて少しゆっくり (-s 130)。あくまで時間整合の基準音。
    subprocess.run(
        ["espeak-ng", "-v", "ja", "-s", "130", "-w", raw_wav, reading],
        check=True, capture_output=True,
    )
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", raw_wav,
         "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", out_wav],
        check=True, capture_output=True,
    )
    return read_wav_mono16k(out_wav)


# ────────────────────────────────────────────────────────────────────
# MFCC（自前実装：numpy.fft のみ）
# ────────────────────────────────────────────────────────────────────
def hz_to_mel(f):
    return 2595.0 * np.log10(1.0 + f / 700.0)


def mel_to_hz(m):
    return 700.0 * (10.0 ** (m / 2595.0) - 1.0)


def mel_filterbank(n_filters, nfft, sr, fmin=0.0, fmax=None):
    if fmax is None:
        fmax = sr / 2.0
    mels = np.linspace(hz_to_mel(fmin), hz_to_mel(fmax), n_filters + 2)
    hzs = mel_to_hz(mels)
    bins = np.floor((nfft + 1) * hzs / sr).astype(int)
    fb = np.zeros((n_filters, nfft // 2 + 1), dtype=np.float32)
    for m in range(1, n_filters + 1):
        l, c, r = bins[m - 1], bins[m], bins[m + 1]
        if c == l:
            c = l + 1
        if r == c:
            r = c + 1
        for k in range(l, c):
            if 0 <= k < fb.shape[1]:
                fb[m - 1, k] = (k - l) / max(1, (c - l))
        for k in range(c, r):
            if 0 <= k < fb.shape[1]:
                fb[m - 1, k] = (r - k) / max(1, (r - c))
    return fb


def dct2_matrix(n_out, n_in):
    """DCT-II 行列（正規直交）。"""
    n = np.arange(n_in)
    k = np.arange(n_out).reshape(-1, 1)
    D = np.cos(np.pi * (2 * n + 1) * k / (2 * n_in)) * np.sqrt(2.0 / n_in)
    D[0, :] *= 1.0 / np.sqrt(2.0)
    return D.astype(np.float32)


def mfcc(x, sr=SR, frame=400, hop=320, nfft=512, n_mels=26, n_cep=13,
         preemph=0.97):
    """MFCC を返す: shape (n_frames, n_cep-1)  ※C0(エネルギー)は除外。"""
    x = np.append(x[0], x[1:] - preemph * x[:-1])  # pre-emphasis
    if len(x) < frame:
        x = np.pad(x, (0, frame - len(x)))
    n_frames = 1 + (len(x) - frame) // hop
    if n_frames < 1:
        n_frames = 1
    idx = np.arange(frame)[None, :] + hop * np.arange(n_frames)[:, None]
    frames = x[idx] * np.hamming(frame).astype(np.float32)
    mag = np.abs(np.fft.rfft(frames, n=nfft)) ** 2 / nfft  # power spectrum
    fb = mel_filterbank(n_mels, nfft, sr)
    melE = np.maximum(mag @ fb.T, 1e-10)
    logmel = np.log(melE).astype(np.float32)
    D = dct2_matrix(n_cep, n_mels)
    cep = logmel @ D.T  # (n_frames, n_cep)
    feat = cep[:, 1:n_cep]  # drop C0 (loudness)
    # CMN: 句間/話者間の音色差を抑える（時間方向に平均減算）
    feat = feat - feat.mean(axis=0, keepdims=True)
    return feat.astype(np.float32)


# ────────────────────────────────────────────────────────────────────
# サブシーケンスDTW（合成=query を全マッチ、実音声=ref は開始/終了自由）
# ────────────────────────────────────────────────────────────────────
def subsequence_dtw(query, ref, band_frames=None):
    """
    query: (Nq, d) 合成MFCC  /  ref: (Nr, d) 実音声MFCC
    返り: path（query各フレーム→ref フレームの対応 index 配列, 長さ Nq）

    Sakoe-Chiba バンド付き:
      線形対角 center(i) = i*(Nr-1)/(Nq-1) の周り ±band_frames のみ許可。
      バンド外は INF。これにより「query をブランドな一点へ潰す」退行を防ぐ。
      band_frames=None ならバンド無し（従来の自由DTW・退行しやすい）。

    開始/終了: バンド内で自由（行0はバンド内全列を初期化、最終行はバンド内最小）。
    ステップ: {(-1,-1)diag, (-1,0)up, (0,-1)left}（局所スロープは無制限だが
              バンドが大域スロープ≒Nr/Nq を強制する）。
    """
    Nq, Nr = query.shape[0], ref.shape[0]
    INF = np.float32(np.inf)
    D = np.full((Nq, Nr), INF, dtype=np.float32)
    bp = np.full((Nq, Nr), -1, dtype=np.int8)  # 0=diag,1=up,2=left

    def band(i):
        if band_frames is None:
            return 0, Nr - 1
        c = i * (Nr - 1) / max(1, (Nq - 1))
        return max(0, int(c - band_frames)), min(Nr - 1, int(c + band_frames))

    # 行0: バンド内を自由開始
    lo0, hi0 = band(0)
    seg = np.sum((ref[lo0:hi0 + 1] - query[0]) ** 2, axis=1)
    D[0, lo0:hi0 + 1] = seg
    bp[0, lo0:hi0 + 1] = 0

    for i in range(1, Nq):
        lo, hi = band(i)
        width = hi - lo + 1
        dist = np.sum((ref[lo:hi + 1] - query[i]) ** 2, axis=1)  # (width,)
        prow = D[i - 1]
        run = np.full(width, INF, dtype=np.float32)   # この行の D[i, lo..hi]
        dirs = np.full(width, -1, dtype=np.int8)
        # j 昇順に走査（left=D[i,j-1] が逐次依存のため）
        for k in range(width):
            j = lo + k
            diag = prow[j - 1] if j - 1 >= 0 else INF   # D[i-1, j-1]
            up = prow[j]                                 # D[i-1, j]
            left = run[k - 1] if k > 0 else INF          # D[i,   j-1]
            best, cdir = diag, 0
            if up < best:
                best, cdir = up, 1
            if left < best:
                best, cdir = left, 2
            if np.isfinite(best):
                run[k] = dist[k] + best
                dirs[k] = cdir
        D[i, lo:hi + 1] = run
        bp[i, lo:hi + 1] = dirs

    # 終了自由: 最終行バンド内の最小
    loE, hiE = band(Nq - 1)
    j = loE + int(np.argmin(D[Nq - 1, loE:hiE + 1]))
    path = np.empty(Nq, dtype=np.int64)
    i = Nq - 1
    while i >= 0:
        path[i] = j
        d = bp[i, j]
        if i == 0 or d < 0:
            break
        if d == 0:
            i -= 1; j -= 1
        elif d == 1:
            i -= 1
        else:
            j -= 1
        if j < 0:
            j = 0
    return path


# ────────────────────────────────────────────────────────────────────
# メイン
# ────────────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lines", required=True, help="JSON: {lines:[{id,reading}]}")
    ap.add_argument("--audio", required=True, help="16kHz mono WAV (実音声)")
    ap.add_argument("--crop", default=None, help="実音声の切り出し秒 'start,end'")
    ap.add_argument("--out", default=None, help="出力 JSON パス")
    ap.add_argument("--hop", type=int, default=320, help="MFCC hop (samples; 320=20ms)")
    ap.add_argument("--band", type=float, default=30.0,
                    help="Sakoe-Chiba バンド半径(秒)。0で無効。退行防止のため既定30s")
    args = ap.parse_args()

    t0 = time.time()
    with open(args.lines, encoding="utf-8") as f:
        spec = json.load(f)
    lines = spec["lines"]

    real = read_wav_mono16k(args.audio)
    crop_start = 0.0
    if args.crop:
        cs, ce = (float(v) for v in args.crop.split(","))
        crop_start = cs
        real = real[int(cs * SR): int(ce * SR)]
    print(f"[info] 実音声 crop = {crop_start:.1f}s 起点, 長さ {len(real)/SR:.1f}s", file=sys.stderr)

    # 1) 句ごとに TTS 合成 → 連結、句境界(サンプル)を記録
    tmpdir = tempfile.mkdtemp(prefix="ttsdtw_")
    synth_parts, bounds = [], []
    cur = 0
    for i, ln in enumerate(lines):
        a = espeak_to_16k(ln["reading"], tmpdir, i)
        bounds.append(cur)          # 句 i の開始サンプル（合成音内）
        synth_parts.append(a)
        cur += len(a)
    bounds.append(cur)              # 番兵（末尾）
    synth = np.concatenate(synth_parts)
    print(f"[info] 合成音 合計 {len(synth)/SR:.1f}s ({len(lines)}句)", file=sys.stderr)

    # 2) MFCC
    hop = args.hop
    q = mfcc(synth, hop=hop)
    r = mfcc(real, hop=hop)
    print(f"[info] MFCC frames: synth={q.shape[0]} real={r.shape[0]} dim={q.shape[1]}",
          file=sys.stderr)
    cells = q.shape[0] * r.shape[0]
    print(f"[info] DTW セル数 ~ {cells:,}（{cells*4/1e6:.0f}MB float32）", file=sys.stderr)

    # 3) サブシーケンスDTW（Sakoe-Chiba バンドで退行防止）
    band_frames = None if args.band <= 0 else int(args.band * SR / hop)
    if band_frames:
        print(f"[info] バンド半径 = {args.band:.0f}s ({band_frames} frames)", file=sys.stderr)
    path = subsequence_dtw(q, r, band_frames=band_frames)  # query frame → real frame

    # 4) 句境界(サンプル) → 合成MFCCフレーム → DTW → 実フレーム → 実時刻
    def sample_to_qframe(s):
        return min(int(s / hop), q.shape[0] - 1)

    results = []
    for i, ln in enumerate(lines):
        qf = sample_to_qframe(bounds[i])
        rf = int(path[qf])
        t = crop_start + rf * hop / SR
        results.append({"id": ln["id"], "start": round(float(t), 2)})

    elapsed = time.time() - t0
    out = {
        "method": "tts-dtw",
        "audio": os.path.basename(args.audio),
        "crop_start": crop_start,
        "hop_ms": hop / SR * 1000,
        "elapsed_sec": round(elapsed, 2),
        "timings": results,
    }
    print("\n=== TTS-DTW 割当結果 ===")
    for rrow in results:
        print(f"  {rrow['id']:>3}  start={rrow['start']:8.2f}s")
    print(f"\n[info] 処理時間 {elapsed:.2f}s", file=sys.stderr)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=2)
        print(f"[info] 書き出し: {args.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
