#!/usr/bin/env python3
"""自我偈区間のフレームをVision OCRし、ページ送り時刻と表示テキストのタイムラインを作る。
動画 = Ground Truth。jg_NNN.png の t = T0 + (NNN-1)。"""
import json, os, re, subprocess, sys

FRAMES = ".cache/frames_jigage"
OCR = ".cache/vision_ocr"
T0 = 388  # jg_001 の動画秒
PAGE_RE = re.compile(r"^[PpＰ]\s*([0-9０-９]{1,3})$")

def z2h(s):
    return s.translate(str.maketrans("０１２３４５６７８９", "0123456789"))

def ocr(path):
    out = subprocess.run([OCR, path], capture_output=True, text=True)
    try:
        return json.load_s if False else json.loads(out.stdout)
    except Exception:
        return {"lines": []}

frames = sorted(f for f in os.listdir(FRAMES) if f.endswith(".png"))
timeline = []
for f in frames:
    n = int(re.search(r"(\d+)", f).group(1))
    t = T0 + (n - 1)
    d = ocr(os.path.join(FRAMES, f))
    page = None
    cols = []  # (y, x, text) high-conf canonical columns
    for l in d.get("lines", []):
        txt = l["text"].strip()
        m = PAGE_RE.match(txt)
        if m:
            page = int(z2h(m.group(1)))
            continue
        # 焼き込み経文：高信頼・漢字主体・長さ4以上
        if l["confidence"] >= 0.88 and len(txt) >= 4 and re.search(r"[一-龯]", txt):
            cols.append((round(l["y"], 3), round(l["x"], 3), txt))
    timeline.append({"t": t, "frame": f, "page": page, "ncols": len(cols), "cols": cols})

# ページ送り検出
print("=== page-turn transitions ===")
prev = None
for e in timeline:
    if e["page"] is not None and e["page"] != prev:
        print(f"  t={e['t']:>4}s  ->  P{e['page']}   (ncols={e['ncols']})")
        prev = e["page"]

# ページ番号が None の連続区間も把握
print("\n=== per-page text (first frame where page is stable & full) ===")
seen = {}
for e in timeline:
    p = e["page"]
    if p is None:
        continue
    # そのページで最も列数が多いフレームを代表に
    if p not in seen or e["ncols"] > seen[p]["ncols"]:
        seen[p] = e
for p in sorted(seen):
    e = seen[p]
    print(f"\n--- P{p}  (t={e['t']}s, ncols={e['ncols']}) ---")
    for y, x, txt in sorted(e["cols"], key=lambda c: (-c[1], -c[0])):  # right->left, top->bottom
        print(f"   x={x:.2f} y={y:.2f}  {txt}")

with open(".cache/jigage_ocr_timeline.json", "w") as fp:
    json.dump(timeline, fp, ensure_ascii=False, indent=1)
print("\nsaved .cache/jigage_ocr_timeline.json  (frames:", len(timeline), ")")
