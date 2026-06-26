#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
基準動画フレームを一定間隔でOCRし、ページ番号と経文テキスト(信頼度付)の時系列を作る。

動画は経本ページめくり形式（右パネル=経文, 左上="P N", 。で句区切り）。
ページ遷移はシーン検出では拾えない（フレーム全体の差分が小さい）ため、
サンプリング＋OCRでページ番号/テキストの変化を直接検出する。

  .cache/vision_ocr（Swift/Vision, 要 swiftc 事前コンパイル）を各フレームに適用。

usage:
  python3 scripts/ocr_pages.py --video .cache/_oN7QCtk3lk.video.mp4 \
      --start 175 --end 470 --step 10 --out .cache/ocr_timeline.json
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile

OCR_BIN = ".cache/vision_ocr"
PAGE_RE = re.compile(r'^[PpＰ]\s*[0-9０-９]+$')


def frame_at(video, t, path):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t:.3f}",
                    "-i", video, "-frames:v", "1", "-q:v", "2", path], check=True)


def ocr(img):
    r = subprocess.run([OCR_BIN, img], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"OCR failed: {r.stderr}")
    return json.loads(r.stdout)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--start", type=float, required=True)
    ap.add_argument("--end", type=float, required=True)
    ap.add_argument("--step", type=float, default=10.0)
    ap.add_argument("--out")
    ap.add_argument("--min-conf", type=float, default=0.5)
    a = ap.parse_args()

    if not os.path.exists(OCR_BIN):
        sys.exit(f"missing {OCR_BIN} — compile: swiftc -O scripts/vision_ocr.swift -o {OCR_BIN}")

    tmp = tempfile.mkdtemp(prefix="ocrpg_")
    rows = []
    t = a.start
    print(f"{'time':>7}  {'page':>4}  text(conf>={a.min_conf})")
    while t <= a.end + 1e-6:
        p = os.path.join(tmp, f"f_{t:.1f}.png")
        frame_at(a.video, t, p)
        o = ocr(p)
        page = None
        sutra = []
        for ln in o["lines"]:
            txt = ln["text"].strip()
            key = txt.replace(" ", "")
            if ln["x"] < 0.35 and ln["y"] > 0.80 and PAGE_RE.match(key):
                page = key
            elif ln["x"] > 0.50:           # 右パネル=経文
                sutra.append(ln)
        sutra.sort(key=lambda l: -l["y"])  # 上→下
        hi = " ".join(l["text"] for l in sutra if l["confidence"] >= a.min_conf)
        rows.append({
            "t": round(t, 1),
            "page": page,
            "text_hi": hi,
            "lines": [{"text": l["text"], "c": round(l["confidence"], 2),
                       "y": round(l["y"], 3), "x": round(l["x"], 3)} for l in sutra],
        })
        print(f"{t:7.1f}  {page or '--':>4}  {hi[:64]}")
        t += a.step

    if a.out:
        with open(a.out, "w", encoding="utf-8") as f:
            json.dump(rows, f, ensure_ascii=False, indent=2)
        print(f"[saved] {a.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
