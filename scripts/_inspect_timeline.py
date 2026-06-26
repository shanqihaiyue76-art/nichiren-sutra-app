#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""一時デバッグ: 指定時間窓のOCR生データ(行/信頼度/y)を上→下で表示。"""
import json
import sys

frames = json.load(open(".cache/ocr_hobenpon_fine.json", encoding="utf-8"))


def show(t0, t1):
    for fr in frames:
        if t0 <= fr["t"] <= t1:
            print(f"--- t={fr['t']} ---")
            for ln in sorted(fr["lines"], key=lambda l: -l["y"]):
                mark = "DROP" if ln["c"] < 0.5 else "    "
                print(f"  {mark} c={ln['c']:.2f} y={ln['y']:.3f}  {ln['text']}")


print("######## 開始シード region (177-193) ########")
show(177, 193)
