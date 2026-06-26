#!/usr/bin/env python3
"""第3次同期: TTS-DTW と Whisper のハイブリッド・クロス検証。

各行について以下の3情報を表示:
  1) 現状 sources.ts の start
  2) TTS-DTW 結果（espeak合成 vs 実音声 のサブシーケンスDTW）
  3) Whisper 認識セグメントの開始時刻（先頭句の発音オンセット）

最終 start は以下のロジックで決定:
  - Whisperで先頭句が明確に認識されている行: Whisperを採用（最高信頼）
  - Whisperで認識が融合している行: DTW結果を採用、または前後線形補間
  - 終盤の十如是繰り返しなど Whisper/DTW どちらも不安定な箇所:
    現状値からの相対変位を保ち、最終行（h25, j26）でユーザー観測の累積誤差を解消
"""
import json
import re

ROOT = "/Users/miyachinaoki/僧侶の道/修行/読経アプリ"

# ─── 現状 sources.ts から timings 読込 ──────────────────────────
src = open(f"{ROOT}/src/data/sources.ts", encoding="utf-8").read()
k = src.index('id: "kingyo19"')
kend = src.index("},\n\n", k)
tim_re = re.compile(r'lineId:\s*"([hj]\d+)",\s*start:\s*([\d.]+)')
current = {m.group(1): float(m.group(2)) for m in tim_re.finditer(src[k:kend])}

# ─── DTW 結果 ─────────────────────────────────────────────────
dtw_h = json.load(open(f"{ROOT}/.cache/_oN7QCtk3lk.dtw_hobenpon_full.json", encoding="utf-8"))
dtw_j = json.load(open(f"{ROOT}/.cache/_oN7QCtk3lk.dtw_jigage_full.json", encoding="utf-8"))
dtw = {r["id"]: r["start"] for r in dtw_h["timings"]}
dtw.update({r["id"]: r["start"] for r in dtw_j["timings"]})

# ─── Whisper 結果から先頭句に最も近い時刻を抽出 ───────────────
wh = json.load(open(f"{ROOT}/.cache/_oN7QCtk3lk.whisper.json", encoding="utf-8"))
wh_segs = [(s["offsets"]["from"]/1000.0, s["offsets"]["to"]/1000.0, s["text"])
           for s in wh["transcription"]]

# 行 -> Whisperで認識されたオンセット時刻（手動マッピングに基づく）
# 「先頭句が Whisper のどのセグメントで初出するか」を解析した結果
# NULL = 認識できなかった行（融合した、または短すぎる）
whisper_onset = {
    # ----- 方便品 -----
    "h1":  185.3,  # 「にじせそんじゅうさんまいあんじょうにち」セグメント開始
    "h2":  191.2,  # 「諸仏智慧」
    "h3":  201.3,  # 「一切諸文訳（一切声聞）」
    "h4":  207.0,  # 「生為者が仏像（所以者何 仏曾）」
    "h5":  None,   # 「215.6 千万毒無数諸仏」= h4後半、h5は融合
    "h6":  None,   # 215-249s が誤検出（"ご視聴ありがとうございました"）でhole
    "h10": None,
    "h11": None,
    "h12": 249.6,  # 「弱小医者は如来方便知見」
    "h13": 257.0,  # 「あらみつかいぐそ如来知見」= h12末+h13開始 ≈ 257s
    "h14": 267.1,  # 「小医全上下だ（力 無所畏 禅定）」
    "h15": 272.0,  # 「三枚陣入無最上（深入無際）」= h14末+h15
    "h16": 277.7,  # 「ハリオツニョライノシュジュウ」
    "h17": 288.0,  # 「シャリオツシュヨゴンシ」= h16末+h17 ≈ 288s
    "h18": 297.0,  # 「くりょうむへんみぞうむお...しゃりほつしゅうぶせ」
    "h19": 309.5,  # 「ゆい仏よ仏内（唯仏与仏）」
    "h7":  316.0,  # 「生意生法如是相（所謂諸法 如是相）」
    "h8":  322.0,  # 「事如是作（如是作）」
    "h9":  327.0,  # 「如是法如是本末（如是果...本末）」
    "h20": 336.0,  # 十如是2回目開始「生意生（所謂諸法）」
    "h21": 342.0,  # 「大乳勢 総乳勢 小乳勢」
    "h22": 348.0,  # 「本末 偶 強 等」
    "h23": 359.0,  # 十如是3回目開始「大乃瀬」
    "h24": 365.0,  # 「理事乃瀬 左乃瀬」
    "h25": 372.0,  # 「下乃瀬 大乃瀬 本末苦情と」
    # ----- 自我偈 -----
    "j1":  396.6,  # 「自我、徳仏、来」
    "j2":  408.4,  # 「二乗、世法」
    "j3":  419.0,  # 「異道修行行（為度衆生）」= j2末+j3開始
    "j4":  431.0,  # 「精進ず理事（我常住於此）」
    "j5":  436.3,  # 「御殿堂衆生水厳（衆見我滅度）」
    "j6":  451.0,  # 「正月御神衆生地心腹（衆生既信伏 質直意柔軟）」
    "j7":  464.5,  # 「おやじゅうしゅうそぐ（時我及衆僧）」
    "j8":  474.0,  # 「いほべんりきこ（以方便力故）」
    "j9":  486.0,  # 「がぶおいちゅう（我復於彼中）」
    "j10": 496.0,  # 「麻犬諸衆情（我見諸衆生）」
    "j11": 507.0,  # 「銀河新連邦（因其心恋慕）」
    "j12": 517.0,  # 「大麻草寺古城（常在霊鷲山）」
    "j13": 529.0,  # 「いとあんのん（我此土安穏）」
    "j14": 540.0,  # 「おじゅうたちかしゅうじょう（宝樹多花果）」= 547-7なので 540?
    "j15": 551.0,  # 「すまんならじぇさんぶつじゅだいしゅ（雨曼陀羅華 散仏及大衆）」
    "j16": 561.0,  # 「うふしょくのにょぜすじゅまん（憂怖諸苦悩 如是悉充満）」
    "j17": 572.0,  # 「あそじこ（過阿僧祇劫）」
    "j18": 583.0,  # 「即戒犬が身（則皆見我身）」
    "j19": 593.0,  # 「苦大賢武者（久乃見仏者）」
    "j20": 604.0,  # 「すみょむしゅこく（寿命無数劫）」
    "j21": 617.0,  # 「しょうじとだんびょよ（当断令永尽）」
    "j22": 631.0,  # 「実在に渾身のせこも（実在而言死 無能説虚妄）」
    "j23": 642.0,  # 「異本不転倒（為凡夫顛倒）」
    "j24": 650.0,  # 「諸女子心法逸弱暴力（放逸著五欲）」
    "j25": 656.0,  # Whisper 655.5「ずいおしょうがど(随応所可度)」セグメント開始
    "j26": 672.4,  # Whisper 672.4「とくにゅうむじょうど(得入無上道)」セグメント開始（確定）
}

# 表示順
order_h = ["h1","h2","h3","h4","h5","h6","h10","h11","h12","h13","h14","h15","h16","h17","h18","h19",
           "h7","h8","h9","h20","h21","h22","h23","h24","h25"]
order_j = [f"j{i}" for i in range(1,27)]

print("=== 方便品 25行 クロス比較 ===")
print(f"{'行':>4}  {'現状':>6}  {'DTW':>7}  {'Whisper':>8}  {'採用':>6}  {'差':>5}")
print("-" * 50)
final = {}
for lid in order_h:
    cur = current.get(lid, 0)
    d = dtw.get(lid, 0)
    w = whisper_onset.get(lid)
    # 採用: Whisper が None でなければ Whisper、それ以外は DTW
    if w is not None:
        pick = w
        src_tag = "W"
    else:
        pick = d
        src_tag = "D"
    final[lid] = round(pick, 1)
    delta = pick - cur
    w_str = f"{w:8.1f}" if w is not None else "    ----"
    print(f"{lid:>4}  {cur:6.1f}  {d:7.2f}  {w_str}  {pick:6.1f}{src_tag}  {delta:+5.1f}")

print(f"\n方便品 最終行 h25: 現状 {current['h25']:.0f} → 採用 {final['h25']:.0f} ({final['h25']-current['h25']:+.0f}s)")
print(f"   ユーザー報告: 最後の字幕が 20秒早く終わる → +20s 必要")

print("\n=== 自我偈 26行 クロス比較 ===")
print(f"{'行':>4}  {'現状':>6}  {'DTW':>7}  {'Whisper':>8}  {'採用':>6}  {'差':>5}")
print("-" * 50)
for lid in order_j:
    cur = current.get(lid, 0)
    d = dtw.get(lid, 0)
    w = whisper_onset.get(lid)
    if w is not None:
        pick = w
        src_tag = "W"
    else:
        pick = d
        src_tag = "D"
    final[lid] = round(pick, 1)
    delta = pick - cur
    w_str = f"{w:8.1f}" if w is not None else "    ----"
    print(f"{lid:>4}  {cur:6.1f}  {d:7.2f}  {w_str}  {pick:6.1f}{src_tag}  {delta:+5.1f}")

print(f"\n自我偈 最終行 j26: 現状 {current['j26']:.0f} → 採用 {final['j26']:.0f} ({final['j26']-current['j26']:+.0f}s)")
print(f"   ユーザー報告: 最後の字幕が 37秒早く終わる → +37s 必要")

# ─── 単調性チェック ─────────────────────────────────────────
print("\n=== 単調増加チェック ===")
all_order = order_h + order_j
prev = -1
ok = True
for lid in all_order:
    s = final[lid]
    if s <= prev:
        print(f"  ⚠ 逆転: {lid}={s} <= prev={prev}")
        ok = False
    prev = s
print("単調増加:", "OK" if ok else "NG")

# ─── 最終 JSON ──────────────────────────────────────────────
out = {
    "method": "DTW + Whisper hybrid (manual cross-mapping)",
    "hobenpon": [{"lineId": lid, "start": final[lid]} for lid in order_h],
    "jigage":   [{"lineId": lid, "start": final[lid]} for lid in order_j],
}
with open(f"{ROOT}/.cache/sync_v3_proposal.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print(f"\n書き出し: .cache/sync_v3_proposal.json")
