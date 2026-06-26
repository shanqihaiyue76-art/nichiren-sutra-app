#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OCRタイムライン(ocr_pages.py の出力)から、スクロール表示を貪欲オーバーラップ統合し、
読誦どおりの線形な句シーケンス（Canonical Draft・暫定）を復元する。

動画は連続スクロール式（句は画面下から現れ上へ抜ける／行内は上=先・下=後）。
隣接フレームは大半が重複するため、各フレームの句列(上→下)を末尾重複でマージして
全文を一意の線形列に再構成する。十如是×3 などの繰り返しは読誦どおり3回展開される。

各句に: 最大信頼度 / 初出時刻 / 観測回数 / 不確実フラグ を付与（捏造しない）。

usage:
  python3 scripts/ocr_assemble.py --timeline .cache/ocr_hobenpon_fine.json \
      --out .cache/hobenpon_canonical_draft.json
"""
import argparse
import json
import re
import sys

KUTEN = "。"
SEP = re.compile(r'[。．.｡]')   # 句点ファミリ(全角/半角/互換)を句区切りとして統一
MIN_CONF = 0.5                  # この信頼度未満のOCRラインは統合前に除去（端の切れ・誤読）
CJK = re.compile(r'[㐀-鿿豈-﫿]')


def norm(s):
    return re.sub(r'[\s　。、，．・]', '', s)


def is_cjk_only(s):
    s2 = norm(s)
    return len(s2) > 0 and all(CJK.match(c) for c in s2)


def jaccard(a, b):
    sa, sb = set(norm(a)), set(norm(b))
    if not sa and not sb:
        return 1.0
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)


def ku_eq(a, b):
    na, nb = norm(a), norm(b)
    if na == nb:
        return True
    # OCR揺れ/部分欠けを許容（短句は厳しめ）
    th = 0.6 if max(len(na), len(nb)) >= 4 else 0.8
    return jaccard(a, b) >= th


def frame_kus(frame, min_conf=MIN_CONF):
    """1フレームの可視句を 上→下 の順で分解。句点ゆれ(。．.｡)を統一し、ノイズ(非CJK/低信頼)を除去。

    OCRは1行に複数句(例『甚深無量。其智慧門。』)を返し、句点が全角/半角/互換で揺れる。
    SEPで句点ファミリを統一して分割しないと、同一行が frame 間で 1句/2句 に揺れ、
    フロンティア照合が崩れて重複追記の原因になる。
    """
    out = []
    lines = sorted(frame["lines"], key=lambda l: -l["y"])  # 上→下
    for ln in lines:
        if ln["c"] < min_conf:
            continue  # 低信頼ライン全体を除去（フレーム端の切れ・誤読）
        for seg in (p.strip() for p in SEP.split(ln["text"])):
            if seg and is_cjk_only(seg):
                out.append({"text": seg, "conf": ln["c"], "y": ln["y"]})
    return out


def stitch(assembly, F, lookback=24):
    """
    スクロール式フレームの統合境界を、フロンティアからさかのぼって同定する。

    assembly末尾(フロンティア)に最も近い既出句を フレームF(上→下) 内で見つけ、
    その「後ろ(=画面で下)」のみを新規として返す。フロンティア句がOCR欠落しても
    数句さかのぼり、2句以上の一致ランで再同定するため、欠落由来の重複追記を防ぐ。
    十如是×3 のような繰り返しは、フロンティア（最新の如是本末究竟等など）を基準に
    その下の新規句だけを足すため、読誦どおり複数回展開される。

    返り: (new_start, j, q, L)
      new_start : F[new_start:] が新規追記対象（= j+1、同定不可なら 0）
      j         : F 内でアンカー句が現れた位置（同定不可なら -1）
      q         : assembly 内のアンカー句 index（同定不可なら -1）
      L         : 同定に用いた一致ラン長
    """
    n = len(assembly)
    A = [r["text"] for r in assembly]
    Ft = [k["text"] for k in F]
    m = len(Ft)
    lo = max(0, n - lookback)
    for q in range(n - 1, lo - 1, -1):          # フロンティア(q大)優先
        for j in range(m - 1, -1, -1):          # Fの下側(j大)優先＝重複追記に保守的
            if not ku_eq(A[q], Ft[j]):
                continue
            run = 1                              # 直前数句でランを確認
            while run < 4 and q - run >= 0 and j - run >= 0 and ku_eq(A[q - run], Ft[j - run]):
                run += 1
            # フロンティア句(q==n-1)は単独一致でも可。それ以外は2句以上を要求しスプリアス回避
            if q == n - 1 or run >= 2:
                return j + 1, j, q, run
    return 0, -1, -1, 0                          # 同定不可 → F全体が新規


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--timeline", required=True)
    ap.add_argument("--out")
    ap.add_argument("--flag-conf", type=float, default=0.6,
                    help="この信頼度未満を『要確認』とフラグ")
    a = ap.parse_args()

    frames = json.load(open(a.timeline, encoding="utf-8"))
    frames.sort(key=lambda f: f["t"])

    assembly = []   # {text, conf, first_t, last_t, n}
    for fr in frames:
        F = frame_kus(fr)
        if not F:
            continue
        if not assembly:
            for k in F:
                assembly.append({"text": k["text"], "conf": k["conf"],
                                 "first_t": fr["t"], "last_t": fr["t"], "n": 1})
            continue
        # フロンティアからさかのぼって同定。新規は画面下(F末尾)＝F[new_start:]のみ。
        new_start, j, q, L = stitch(assembly, F)
        # 重複部: F[0:new_start] ↔ assembly[q-j : q+1]。高信頼の読みを採用し観測回数を加算。
        if j >= 0:
            base = q - j                         # F[0] に対応する assembly index
            for i in range(new_start):
                ai = base + i
                if 0 <= ai < len(assembly):
                    r = assembly[ai]
                    k = F[i]
                    # 同一句と確認できた対のみ統合。誤対応の上書き(捏造)を禁止。
                    if not ku_eq(r["text"], k["text"]):
                        continue
                    r["last_t"] = fr["t"]
                    r["n"] += 1
                    if k["conf"] > r["conf"]:     # 同一句の高信頼読み(例 三味→三昧)を採用
                        r["conf"] = k["conf"]
                        r["text"] = k["text"]
        # 新規部: F[new_start:] のみ追記（再表示された重複は飛ばす）
        for k in F[new_start:]:
            assembly.append({"text": k["text"], "conf": k["conf"],
                             "first_t": fr["t"], "last_t": fr["t"], "n": 1})

    # 欠落候補の検出（QA: OCRが視認したが信頼度<閾値で不採用となり、最終列にも現れない句。
    # 前方貪欲統合では、低信頼で見送った句がフロンティア通過後に閾値を超えても挿入できず
    # 静かに欠落する。捏造で埋めず『要確認の欠落候補』として明示する。）
    assembled_norm = {norm(r["text"]) for r in assembly}
    assembled_texts = [r["text"] for r in assembly]

    def in_assembly(seg):
        if norm(seg) in assembled_norm:
            return True
        return any(ku_eq(seg, t) for t in assembled_texts)

    dropped = {}   # norm(seg) -> {text, conf, first_t, frames}
    for fr in frames:
        for ln in fr["lines"]:
            if ln["c"] >= MIN_CONF:
                continue   # 採用ラインは対象外（欠落ではない）
            for seg in (p.strip() for p in SEP.split(ln["text"])):
                ns = norm(seg)
                if len(ns) < 4 or not is_cjk_only(seg) or in_assembly(seg):
                    continue
                d = dropped.get(ns)
                if d is None:
                    dropped[ns] = {"text": seg, "conf": ln["c"],
                                   "first_t": fr["t"], "frames": 1}
                else:
                    d["frames"] += 1
                    if ln["c"] > d["conf"]:
                        d["conf"], d["text"] = ln["c"], seg
    # 単発(1フレームのみ)はOCRノイズとみなし除外。複数フレーム永続のみ候補化し、
    # 表記ゆれ(昧/味 等の ku_eq 同一句)は最早出現を代表に統合（位置は初出時刻基準で正しくなる）。
    cands = sorted((x for x in dropped.values() if x["frames"] >= 2),
                   key=lambda x: x["first_t"])
    merged = []
    for d in cands:
        hit = next((m for m in merged if ku_eq(m["text"], d["text"])), None)
        if hit is None:
            merged.append(dict(d))
        else:
            hit["frames"] += d["frames"]
            if d["conf"] > hit["conf"]:        # 同一句のより高信頼な読みを代表に採用
                hit["conf"], hit["text"] = d["conf"], d["text"]
    gaps = []
    for d in merged:
        after = sum(1 for r in assembly if r["first_t"] <= d["first_t"]) - 1
        gaps.append({"text": d["text"], "conf": round(d["conf"], 2),
                     "first_t": d["first_t"], "frames": d["frames"],
                     "after_idx": after})   # after_idx の直後への挿入が推定位置（初出時刻基準）

    # フラグ付け
    draft = []
    for i, r in enumerate(assembly):
        flags = []
        if r["conf"] < a.flag_conf:
            flags.append("low_conf")
        if not is_cjk_only(r["text"]):
            flags.append("non_cjk")
        if r["n"] == 1:
            flags.append("single_obs")
        draft.append({
            "idx": i,
            "text": r["text"],
            "conf": round(r["conf"], 2),
            "first_t": r["first_t"],
            "n_obs": r["n"],
            "flags": flags,
        })

    # 表示
    n_total = len(draft)
    n_flag = sum(1 for d in draft if d["flags"])
    print(f"=== Canonical Draft（暫定 / 方便品 OCR）: {n_total}句, 要確認 {n_flag}句 ===")
    for d in draft:
        mark = "⚠" if d["flags"] else " "
        fl = ("[" + ",".join(d["flags"]) + "]") if d["flags"] else ""
        print(f"{mark}{d['idx']:3d}  c={d['conf']:.2f} t={d['first_t']:6.1f} n={d['n_obs']:2d}  {d['text']}  {fl}")
    print(f"\n合計 {n_total}句 / 要確認 {n_flag}句 ({100*n_flag/max(1,n_total):.0f}%)")

    if gaps:
        print(f"\n--- 欠落候補（OCR視認・信頼度<{MIN_CONF}で不採用・最終列に不在 / 要・経本照合）: {len(gaps)}件 ---")
        for g in gaps:
            print(f"  c={g['conf']:.2f} t={g['first_t']:6.1f} frames={g['frames']:2d}  "
                  f"{g['text']}  （推定位置: idx{g['after_idx']}直後）")
    else:
        print("\n--- 欠落候補: なし（信頼度<閾値で永続的に視認された未採用句は検出されず） ---")

    if a.out:
        json.dump({"source": "ocr-draft", "sutra": "hobenpon",
                   "note": "暫定Canonical Draft。基準動画OCR由来。正式正解ではない。要・経本照合。",
                   "min_conf": MIN_CONF,
                   "lines": draft,
                   "dropped_candidates": gaps}, open(a.out, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=2)
        print(f"[saved] {a.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
