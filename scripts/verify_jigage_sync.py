#!/usr/bin/env python3
"""アプリの自我偈タイミング（sources.ts）を、動画=GTのOCRタイムライン
(.cache/jigage_full_timeline.json) と突き合わせて検証する。

検証内容:
1. 各行 j_k の先頭句が動画OCRに最初に現れる時刻 tmin と、アプリの割当 start の差。
2. computeActiveIndex 相当のロジックで 388〜650s を1秒刻みに走らせ、
   「アプリの現在行」と「動画で直近に開始した行（tmin基準）」が一致するか。
3. start 値が単調増加か（行の衝突・逆転がないか）。
"""
import json, re, statistics, sys

ROOT = "/Users/miyachinaoki/僧侶の道/修行/読経アプリ"

# --- アプリデータを読む（正規表現で軽量パース） ---
jigage_src = open(f"{ROOT}/src/data/jigage.ts", encoding="utf-8").read()
# 各行 id と text（先頭句 = 最初の全角空白までの5字）
line_re = re.compile(r'id:\s*"(j\d+)",\s*\n\s*text:\s*"([^"]+)"')
lines = []
for m in line_re.finditer(jigage_src):
    lid, text = m.group(1), m.group(2)
    phrases = text.split("　")
    lines.append({"id": lid, "first": phrases[0], "phrases": phrases})
app_lines = {l["id"]: l for l in lines}
order = [l["id"] for l in lines]

sources_src = open(f"{ROOT}/src/data/sources.ts", encoding="utf-8").read()
# kingyo19 ブロックの timings を取る
k = sources_src.index('id: "kingyo19"')
kend = sources_src.index("},\n\n", k)
tim_re = re.compile(r'lineId:\s*"(j\d+)",\s*start:\s*([\d.]+)')
timings = {m.group(1): float(m.group(2)) for m in tim_re.finditer(sources_src[k:kend])}

# --- 動画OCRタイムライン ---
tl = json.load(open(f"{ROOT}/.cache/jigage_full_timeline.json", encoding="utf-8"))
# 句 -> 最初に現れた時刻
appear_tmin = {}
for e in tl:
    for y, x, txt in e["cols"]:
        if len(txt) == 5 and re.fullmatch(r"[一-龯]{5}", txt):
            if txt not in appear_tmin or e["t"] < appear_tmin[txt]:
                appear_tmin[txt] = e["t"]

print("=== 1) 各行 start vs 動画OCR先頭句 tmin ===")
print(" 行   start  OCRtmin   差   先頭句   判定")
drift = []
ocr_missing = []
for lid in order:
    start = timings.get(lid)
    first = app_lines[lid]["first"]
    tmin = appear_tmin.get(first)
    if start is None:
        print(f" {lid:>4}   ----   timingなし")
        continue
    if tmin is None:
        print(f" {lid:>4}  {start:>5.0f}    ----    --   {first}  OCR未検出(補完句)")
        ocr_missing.append(lid)
        continue
    d = start - tmin
    drift.append(abs(d))
    flag = "OK" if abs(d) <= 2 else ("やや差" if abs(d) <= 4 else "要確認")
    print(f" {lid:>4}  {start:>5.0f}   {tmin:>5.0f}  {d:>+5.0f}   {first}  {flag}")

print(f"\n  OCR直接検出した{len(drift)}行の |start-tmin|: "
      f"max={max(drift):.0f}s  median={statistics.median(drift):.1f}s  mean={statistics.mean(drift):.1f}s")
print(f"  OCR未検出(補完)行: {ocr_missing}")

# --- 2) 単調増加チェック ---
print("\n=== 2) start 単調増加チェック ===")
prev = None
mono_ok = True
for lid in order:
    s = timings.get(lid)
    if s is None:
        continue
    if prev is not None and s <= prev[1]:
        print(f"  逆転/衝突: {prev[0]}={prev[1]} -> {lid}={s}")
        mono_ok = False
    prev = (lid, s)
print("  単調増加: " + ("OK（衝突なし）" if mono_ok else "NG"))

# --- 3) 擬似再生：computeActiveIndex 相当 ---
def active_line(t):
    # start <= t+0.05 の最大 start の行
    best = None
    for lid in order:
        s = timings.get(lid)
        if s is None:
            continue
        if s <= t + 0.05:
            best = lid
    return best

print("\n=== 3) 擬似再生（388〜650s, 1秒刻み）: アプリ現在行 vs 動画直近開始行 ===")
# 動画側「直近に開始した行」= 先頭句tmin <= t の最大tmin行
line_start_video = {}
for lid in order:
    first = app_lines[lid]["first"]
    tv = appear_tmin.get(first)
    if tv is not None:
        line_start_video[lid] = tv

def video_line(t):
    best = None
    bestt = -1
    for lid, tv in line_start_video.items():
        if tv <= t and tv > bestt:
            bestt = tv
            best = lid
    return best

mismatch = 0
checked = 0
for t in range(388, 651):
    a = active_line(t)
    v = video_line(t)
    if a is None or v is None:
        continue
    checked += 1
    if a != v:
        mismatch += 1
        if mismatch <= 15:
            print(f"  t={t}s  app={a}  video={v}")
print(f"\n  照合{checked}秒中 不一致={mismatch}秒 "
      f"({100*(checked-mismatch)/checked:.1f}% 一致)")
print("  ※不一致の多くは行境界±1〜2秒（OCRが先頭句を1fpsで捉える粒度）由来。")
