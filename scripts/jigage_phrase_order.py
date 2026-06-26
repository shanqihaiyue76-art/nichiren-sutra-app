#!/usr/bin/env python3
"""スクロールする焼き込み字幕から、各5字句の出現時刻を集計し、
動画=GTとして (1)正準な句の並び (2)各句が画面中央基準を通過する時刻 を推定する。"""
import json, re, statistics
tl = json.load(open(".cache/jigage_ocr_timeline.json"))

# 句 -> [(t, y)]
appear = {}
for e in tl:
    for y, x, txt in e["cols"]:
        # ノイズ除去：5字の漢字句のみ（焼き込み経文の単位）
        if len(txt) == 5 and re.fullmatch(r"[一-龯]{5}", txt):
            appear.setdefault(txt, []).append((e["t"], y))

rows = []
for txt, pts in appear.items():
    ts = [t for t, _ in pts]
    ys = [y for _, y in pts]
    rows.append({
        "txt": txt, "n": len(pts),
        "tmin": min(ts), "tmed": round(statistics.median(ts), 1), "tmax": max(ts),
        "ymed": round(statistics.median(ys), 2),
    })

# 出現が1回だけの句はOCRノイズの可能性 → 残すが印
rows.sort(key=lambda r: r["tmed"])
print(f"distinct 5-char phrases: {len(rows)}\n")
print(" idx  tmed  tmin tmax  n  ymed  phrase")
for i, r in enumerate(rows):
    flag = " <-1" if r["n"] == 1 else ""
    print(f" {i:>3}  {r['tmed']:>5}  {r['tmin']:>4} {r['tmax']:>4} {r['n']:>2}  {r['ymed']:.2f}  {r['txt']}{flag}")

json.dump(rows, open(".cache/jigage_phrase_order.json", "w"), ensure_ascii=False, indent=1)
