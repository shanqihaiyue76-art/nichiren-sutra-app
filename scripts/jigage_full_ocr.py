#!/usr/bin/env python3
"""自我偈の全区間を Vision OCR し、句の並び＋出現時刻(tmin≒朗読開始)を出力。
usage: jigage_full_ocr.py <frames_dir> <t0>"""
import json, os, re, statistics, subprocess, sys

FRAMES = sys.argv[1]
T0 = int(sys.argv[2])
OCR = ".cache/vision_ocr"
PAGE_RE = re.compile(r"^[PpＰ]\s*([0-9０-９]{1,3})$")

def ocr(path):
    out = subprocess.run([OCR, path], capture_output=True, text=True)
    try:
        return json.loads(out.stdout)
    except Exception:
        return {"lines": []}

frames = sorted(f for f in os.listdir(FRAMES) if f.endswith(".png"))
timeline = []
for f in frames:
    n = int(re.search(r"(\d+)", f).group(1))
    t = T0 + (n - 1)
    d = ocr(os.path.join(FRAMES, f))
    page = None
    cols = []
    for l in d.get("lines", []):
        txt = l["text"].strip()
        m = PAGE_RE.match(txt)
        if m:
            page = int(m.group(1).translate(str.maketrans("０１２３４５６７８９", "0123456789")))
            continue
        if l["confidence"] >= 0.88 and len(txt) >= 4 and re.search(r"[一-龯]", txt):
            cols.append([round(l["y"], 3), round(l["x"], 3), txt])
    timeline.append({"t": t, "page": page, "cols": cols})
json.dump(timeline, open(".cache/jigage_full_timeline.json", "w"), ensure_ascii=False)

# 句 -> 出現時刻
appear = {}
for e in timeline:
    for y, x, txt in e["cols"]:
        if len(txt) == 5 and re.fullmatch(r"[一-龯]{5}", txt):
            appear.setdefault(txt, []).append((e["t"], y))
rows = []
for txt, pts in appear.items():
    ts = [t for t, _ in pts]
    rows.append({"txt": txt, "n": len(pts), "tmin": min(ts),
                 "tmed": round(statistics.median(ts), 1), "tmax": max(ts),
                 "ymed": round(statistics.median([y for _, y in pts]), 2)})
rows.sort(key=lambda r: (r["tmin"], r["tmed"]))
json.dump(rows, open(".cache/jigage_full_order.json", "w"), ensure_ascii=False, indent=1)

print(f"frames={len(timeline)}  distinct 5-char phrases={len(rows)}")
print("page turns:")
prev = None
for e in timeline:
    if e["page"] is not None and e["page"] != prev:
        print(f"  t={e['t']:>4}s -> P{e['page']}")
        prev = e["page"]
print("\n idx  tmin tmed tmax  n  ymed phrase")
for i, r in enumerate(rows):
    fl = " <-noise?" if r["n"] <= 2 else ""
    print(f" {i:>3}  {r['tmin']:>4} {r['tmed']:>5} {r['tmax']:>4} {r['n']:>2}  {r['ymed']:.2f} {r['txt']}{fl}")
