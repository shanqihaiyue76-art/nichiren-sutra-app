#!/usr/bin/env python3
"""方便品＋自我偈の全タイミングを動画OCR Ground Truth と突き合わせる。

GT:
  - 方便品: .cache/hobenpon_ground_truth.json (first_t)
  - 自我偈: .cache/jigage_full_timeline.json    (各句のtmin)
"""
import json, re, statistics

ROOT = "/Users/miyachinaoki/僧侶の道/修行/読経アプリ"

# --- アプリの行データを読む（hobenpon + jigage）---
def parse_lines(path):
    src = open(path, encoding="utf-8").read()
    rows = []
    for m in re.finditer(r'id:\s*"([hj]\d+)",\s*\n\s*text:\s*"([^"]+)"', src):
        lid, text = m.group(1), m.group(2)
        phrases = text.split("　")
        rows.append({"id": lid, "first": phrases[0], "text": text, "phrases": phrases})
    return rows

hb_lines = parse_lines(f"{ROOT}/src/data/hobenpon.ts")
jg_lines = parse_lines(f"{ROOT}/src/data/jigage.ts")

# --- sources.ts kingyo19 timings ---
src = open(f"{ROOT}/src/data/sources.ts", encoding="utf-8").read()
k = src.index('id: "kingyo19"')
kend = src.index("},\n\n", k)
tim_re = re.compile(r'lineId:\s*"([hj]\d+)",\s*start:\s*([\d.]+)')
timings = {m.group(1): float(m.group(2)) for m in tim_re.finditer(src[k:kend])}

# --- 方便品 GT ---
hb_gt = json.load(open(f"{ROOT}/.cache/hobenpon_ground_truth.json", encoding="utf-8"))
# 句 -> first_t（同じ句が複数あれば一番早いものを採用）
hb_first = {}
for L in hb_gt["lines"]:
    txt = L["text"]
    t = L["first_t"]
    if txt not in hb_first or t < hb_first[txt]:
        hb_first[txt] = t

# 同じ句が複数回出る場合の出現順リスト
def hb_repeats(phrase):
    return sorted([L["first_t"] for L in hb_gt["lines"] if L["text"] == phrase])

# 全ての繰り返し句のカウンタ（舎利弗、所以者何、十如是各句…）
hb_rep_count = {}
def hb_next_t(phrase):
    reps = hb_repeats(phrase)
    if len(reps) <= 1:
        return reps[0] if reps else None
    idx = hb_rep_count.get(phrase, 0)
    hb_rep_count[phrase] = idx + 1
    return reps[idx] if idx < len(reps) else reps[-1]

# --- 自我偈 GT ---
jg_tl = json.load(open(f"{ROOT}/.cache/jigage_full_timeline.json", encoding="utf-8"))
jg_first = {}
for e in jg_tl:
    for y, x, txt in e["cols"]:
        if len(txt) == 5 and re.fullmatch(r"[一-龯]{5}", txt):
            if txt not in jg_first or e["t"] < jg_first[txt]:
                jg_first[txt] = e["t"]

# --- アプリの flat order（hobenpon section順 → jigage順）---
# hobenpon.ts の section/line順を取る
src_h = open(f"{ROOT}/src/data/hobenpon.ts", encoding="utf-8").read()
section_re = re.compile(r'id:\s*"(\w+)",\s*\n\s*title:\s*"[^"]+",\s*\n\s*lines:')
# ざっくり：sections[].lines[] の id を section単位で集める
sections = []
for sm in re.finditer(r'id:\s*"(chogyo|juppokai)"[^}]*?lines:\s*\[(.+?)\]\s*,?\s*\}', src_h, re.S):
    sec_id = sm.group(1)
    body = sm.group(2)
    ids = [m.group(1) for m in re.finditer(r'id:\s*"(h\d+)"', body)]
    sections.append((sec_id, ids))
flat_h = [lid for _, ids in sections for lid in ids]
flat_j = [l["id"] for l in jg_lines]

print("=== 方便品 全25行 vs 動画OCR first_t ===")
print(" 順  ID    start  OCR    差   先頭句")
prev_t = -1
mono = True
hb_drift = []
for i, lid in enumerate(flat_h):
    line = next((l for l in hb_lines if l["id"] == lid), None)
    if not line:
        print(f" {i+1:>2} {lid:>4}  not found")
        continue
    start = timings.get(lid)
    first = line["first"]
    # 繰り返し句（舎利弗・所以者何・十如是…）は出現順で対応するGTを取る
    gt = hb_next_t(first)
    if start is None:
        print(f" {i+1:>2} {lid:>4}  timingなし!")
        continue
    if gt is None:
        print(f" {i+1:>2} {lid:>4}  {start:>5.0f}  ----    --   {first}  GT欠")
        continue
    d = start - gt
    hb_drift.append(abs(d))
    flag = "" if abs(d) <= 2 else (" やや差" if abs(d) <= 5 else " 要確認")
    print(f" {i+1:>2} {lid:>4}  {start:>5.0f} {gt:>5.0f} {d:>+4.0f}    {first}{flag}")
    if prev_t >= 0 and start <= prev_t:
        print(f"     ↑ 単調性NG（前={prev_t}）")
        mono = False
    prev_t = start

print(f"\n  方便品 |start-OCR|: max={max(hb_drift):.0f}s  median={statistics.median(hb_drift):.1f}s  mean={statistics.mean(hb_drift):.1f}s")
print(f"  単調増加: {'OK' if mono else 'NG'}")

print("\n=== 自我偈 全26行（参照のみ）===")
jg_drift = []
for lid in flat_j:
    line = next((l for l in jg_lines if l["id"] == lid), None)
    start = timings.get(lid)
    first = line["first"]
    gt = jg_first.get(first)
    if gt is None or start is None:
        continue
    jg_drift.append(abs(start - gt))
print(f"  自我偈 |start-OCR|: max={max(jg_drift):.0f}s  median={statistics.median(jg_drift):.1f}s  mean={statistics.mean(jg_drift):.1f}s")

# 全体 単調性
print("\n=== 全51行 単調性チェック ===")
all_ids = flat_h + flat_j
prev_t = -1
ok = True
for lid in all_ids:
    s = timings.get(lid)
    if s is None:
        print(f"  {lid}: timingなし"); ok = False; continue
    if s <= prev_t:
        print(f"  {lid}: 逆転 {prev_t} -> {s}"); ok = False
    prev_t = s
print("  単調増加: " + ("OK（51行衝突なし）" if ok else "NG"))
