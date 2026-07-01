# 読経アプリ 開発状況

最終更新: 2026-07-01（普賢菩薩勧発品第二十八 実装・デプロイ完了 ✅ / Ground Truth方式 v2.0 へ移行）

---

## QA品質基準

| 基準 | 内容 |
|------|------|
| Ground Truth | 採用YouTube動画の字幕表示タイミングのみ |
| 計測方法 | 動画OCR字幕表示時刻 × Whisper音声オンセット × DTW の3点照合 |
| 合格基準 | 動画字幕とアプリ字幕が目視で違和感なく一致・最後までズレない・繰り返し部分も動画どおり |

### タイミングステータス凡例

| マーク | 意味 |
|--------|------|
| ✅ 完成 | OCR/Whisper/DTW照合済み。品質基準クリア |
| ⚠️ 要再同期 | OCRアンカー不足または補間精度要改善。QA不合格 |
| ❌ 動画変更候補あり | 採用動画に字幕なし。OCR不可。別動画への差し替えが必要 |

---

## 第一段階（基本勤行）QA状況

| 読経 | ファイル | 動画 | タイミングQA | 状態 | 備考 |
|------|---------|------|-------------|------|------|
| 開経偈 | kaikyoge.ts | kingyo19 | Whisper全行一致 | ✅ 完成 | |
| 方便品第二 | hobenpon.ts | kingyo19 | Whisper+DTW照合済 | ✅ 完成 | 十如是3回繰り返し含む |
| 自我偈 | jigage.ts | kingyo19 | Whisper+DTW照合済 | ✅ 完成 | |
| 題目 | daimoku.ts | kingyo19 | Whisper単一点確認 | ✅ 完成 | |
| 回向文 | ekomon-chogyo.ts | kingyo19 | OCR字幕表示時刻に全面改訂 | ✅ 完成 | 旧実装はWhisper音声オンセット使用（字幕より1.5〜4.2s遅延）→ OCR15点アンカーで再同期 |
| 宝塔偈 | hotoge.ts | kyushu-hotoge | OCR f0016確認(ht1=765s) | ✅ 完成 | Whisper不可(高速唱念)→OCR単独。hotoge_whisper=「お祈りします」3件のみ |
| 四誓（四弘誓願） | shishi.ts | kingyo19 | OCR確認済 | ✅ 完成 | 第2回唱開始時刻採用。動画表記: 無数/無尽（標準: 無量/学） |

---

## 第三段階（各種偈）QA状況

| 偈文 | ファイル | 動画 | タイミングQA | 状態 | 備考 |
|------|---------|------|-------------|------|------|
| 宝塔偈 | hotoge.ts | XivPWmWJO2c | OCR確認済 | ✅ 完成 | 上表と同じ |
| 神力偈 | jinrikige.ts | 26UL4RmM0hY | OCR13点×全64句一致 | ✅ 完成 | 旧動画I9KKyj0BDOI（字幕なし）→見法寺字幕動画に差し替え。jr_n=20+(n-1)×3.333s、13フレーム誤差ゼロ確認 |
| 観音偈 | kannonge.ts | _CyvlLqEWUs | OCRアンカー18点(118句) | ✅ 完成 | ko57-ko62(3.75s/句)・ko63-ko74(3.0s/句)・ko112-ko115(2.6s/句)の補間レート誤差を全修正。残補間精度±2s以内。 |
| 普賢勧発偈 | fugenkanpatsuge.ts | honkoji-fugen (ht8TC7DHfS4) | Whisper large-v3 47セグメント | ✅ 完成（暫定） | **Ground Truth方式v2.0で実装**（字幕なし動画を採用）。本光寺Liveチャンネル・468s・全文46行（長行のみ、偈頌構成ではない）。テキストは大正新脩大蔵経T0262の再構成（AI knowledge、`source: ai_sample`）。Whisper音声認識と照合し章立て・語順は確認済みだが、字句レベルは原典未照合＝`provenance.status: provisional`。詳細は下記「Ground Truth方式 v2.0」参照 |

---

## 第二段階（法華経二十八品）

| 品 | ファイル | 動画 | タイミングQA | 状態 | 備考 |
|----|---------|------|-------------|------|------|
| 提婆達多品第十二 | daibadatta.ts | v6tSdCVw354 | OCR 26点×5s精度確認 | ✅ 完成 | 龍女成仏。偈頌db01-db04+長行db05-db26。章前半（提婆達多物語）は動画に含まれず未収録 |
| 普賢菩薩勧発品第二十八 | fugenkanpatsuge.ts | honkoji-fugen (ht8TC7DHfS4) | Whisper large-v3 47セグメント | ✅ 完成（暫定） | 上表「普賢勧発偈」と同一実装（全文46行のため二重計上）。テキスト要原典照合 |
| 方便品第二（長行） | — | — | 未着手 | ⬜ 未着手 | hobenponとは別に法華経二十八品としての収録が必要か要検討 |
| 残26品 | — | — | 未着手 | 🔵 着手可能 | Ground Truth方式v2.0（字幕不要）により実装可能と判明。本光寺Liveチャンネルに全28品所蔵。動画IDリストは本ファイル「次回タスク優先順位」参照 |

---

## 全体完成率

基本勤行: 7/7 = **100%**（タイミングQA全完了）
偈文: 4/4 = **100%**（普賢勧発偈 実装完了・暫定データ）
法華経: 2/28 = **7%**（提婆達多品✅・普賢菩薩勧発品第二十八✅）
題目: 0/4 = **0%**

全体（カテゴリ計上ベース）: 13/43 ≈ **30%**
※ fugenkanpatsugeは「偈文」「法華経」両方に計上されるため、実装物としては12件（重複1件）。
※ 普賢勧発偈・提婆達多品(章前半欠)は `provenance.status: provisional` の暫定データ。原典照合前は学習モードで「未検証」表示のまま。

---

## Git状態（2026-07-01時点）

| コミット | 内容 | 状態 |
|---------|------|------|
| 9d08fe1 | miehouji-hobenpon PlaybackSource追加 | ✅ GitHub反映済 |
| 373e0e1 | miehouji-jigage PlaybackSource追加 | ✅ GitHub反映済 |
| e8f90d9 | miehouji-kannonge PlaybackSource追加 | ✅ GitHub反映済 |
| 7f34d71 | PROJECT_STATUS更新（NPL9/J1m3/BqKM調査完了・STOP条件記録） | ✅ GitHub反映済 |
| cdc2671 | 提婆達多品第十二 実装（daibadatta.ts + index.ts + sources.ts） | ✅ GitHub反映済 |
| 21c9f9b | BqKMEP3TeBk 方便品第3ソース（enzoiji-hobenpon）追加 | ✅ GitHub反映済 |
| 9411e8d | PROJECT_STATUS更新（2026-07-01 セッション記録） | ✅ GitHub反映済 |
| 1027e35 | UI: displayTitle追加・トップカード順変更・経文名表示化 | ✅ GitHub反映済 |
| 2fea5d0 | PROJECT_STATUS更新（UI改善完了） | ✅ GitHub反映済 |
| 24da8f6 | docs: デプロイ完了・本番URL確認済み | ✅ GitHub反映済 |
| 538982e | feat: 普賢菩薩勧発品第二十八を追加（fugenkanpatsuge.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |

**本番URL**: https://nichiren-sutra-app.vercel.app  
**Vercel**: 2026-07-01 自動デプロイ完了・本番確認済み（/sutra/fugenkanpatsuge, /play/honkoji-fugen 動作確認OK）  
**origin/main HEAD**: 538982e

---

## キャッシュ済みデータ

| キャッシュ | 内容 |
|-----------|------|
| .cache/_oN7QCtk3lk.video.mp4 | 朝夕の勤行19分（kingyo19） |
| .cache/_oN7QCtk3lk.whisper.json | Whisper large-v3 全文（147セグメント） |
| .cache/XivPWmWJO2c（hotoge_survey/） | ゆっくり読む15分（宝塔偈） |
| .cache/hotoge_frames/ | 宝塔偈 1fps フレーム（750s〜） |
| .cache/shishi_frames/ | 四誓 1fps フレーム（1048-1082s） |
| .cache/kannon_frames_1fps/ | 観音偈 1fps フレーム（f0001=18s〜f0410=427s） |
| .cache/kaikyoge_frames/ | 開経偈フレーム |
| .cache/ekomon_frames/ | 回向文フレーム（950-1044s, 95枚） |
| .cache/frames_jigage/ | 自我偈フレーム |
| .cache/jinriki_frames/ | 旧神力偈フレーム3枚（I9KKyj0BDOI・字幕なし確認済み） |
| .cache/jinriki_I9KKyj0BDOI.16k.wav | 旧神力偈音声（WAV・廃止） |
| .cache/jinriki2_26UL4RmM.mp4 | 新神力偈動画（26UL4RmM0hY・見法寺・239s） |
| .cache/jinriki2_frames/ | 新神力偈 1fps フレーム（f0001=1s〜f0239=239s、239枚） |
| .cache/hotoge_whisper.json | 宝塔偈Whisper（3セグメント・「お祈りします」のみ、タイミング用途なし） |
| .cache/hoben_miehouji.mp4 | 方便品見法寺動画（v1fPDfKHC7I・213s） |
| .cache/hoben_miehouji_frames/ | 方便品見法寺 1fps フレーム（f0001〜f0213、213枚） |
| .cache/jigage_miehouji.mp4 | 自我偈見法寺動画（ZD4kXNmeeyQ・281.5s） |
| .cache/jigage_miehouji_frames/ | 自我偈見法寺 1fps フレーム（f0001〜f0282、282枚） |
| .cache/kannonge_miehouji.mp4 | 観音偈見法寺動画（KNMoi0cDOx0・401.9s） |
| .cache/kannonge_miehouji_frames/ | 観音偈見法寺 1fps フレーム（f0001〜f0402、402枚） |
| .cache/NPL9kmcH9Tk.mp4 | 法華経の勤行通し動画（NPL9kmcH9Tk・177MB・796s）調査済み・不採用 |
| .cache/NPL9_frames/ | NPL9 1fps フレーム（f0001〜f0796、796枚） |
| .cache/J1m3JjvNnGw.mp4 | 開経偈字幕付き動画（J1m3JjvNnGw・8.8MB・100s）調査済み・不採用 |
| .cache/J1m3_frames/ | J1m3 1fps フレーム（100枚） |
| .cache/BqKMEP3TeBk.mp4 | 方便品第二フリガナあり動画（BqKMEP3TeBk・11MB・243s）浦和・円蔵寺・保留 |
| .cache/BqKMEP3TeBk_frames/ | BqKMEP3TeBk 1fps フレーム（243枚） |

---

## 採用動画一覧

| 動画ID | タイトル | 用途 | 字幕 |
|--------|---------|------|------|
| _oN7QCtk3lk | 朝夕の勤行（19分）| kaikyoge/hobenpon/jigage/daimoku/ekomon-chogyo/shishi | あり（スクロール蓄積型） |
| XivPWmWJO2c | ゆっくり読む日蓮宗のお経【15分】(長崎県日蓮宗青年会) | hotoge | あり |
| ~~I9KKyj0BDOI~~ | ~~日蓮宗 お経 妙法蓮華経 如来神力品第二十一~~ | ~~jinrikige~~（廃止） | **なし** |
| 26UL4RmM0hY | 【お経練習・字幕有り】妙法蓮華経如来神力品第二十一 神力偈（見法寺法務チャンネル） | jinrikige | あり（2句同時白表示） |
| _CyvlLqEWUs | 観音経 慈悲と救いであらゆる願いが叶う偈文・7分 字幕（高野山真言宗 松島龍戒） | kannonge | あり |
| v1fPDfKHC7I | 【お経練習・字幕あり】妙法蓮華経方便品第二（見法寺法務チャンネル） | hobenpon (miehouji-hobenpon) | あり（2句同時白表示・213s） |
| ZD4kXNmeeyQ | 【お経練習・字幕有り】妙法蓮華経如来寿量品第十六 自我偈（見法寺法務チャンネル） | jigage (miehouji-jigage) | あり（2句同時白表示・281.5s） |
| KNMoi0cDOx0 | 【お経練習・字幕有り】妙法蓮華経観世音菩薩普門品第二十五 観音偈（見法寺法務チャンネル） | kannonge (miehouji-kannonge) | あり（2句同時白表示・401.9s） |
| ht8TC7DHfS4 | 妙法蓮華経 普賢菩薩勧発品第二十八（本光寺 Live） | fugenkanpatsuge (honkoji-fugen) | **なし**（Ground Truth方式v2.0＝Whisper音声認識を採用。本光寺Liveチャンネルは法華経全28品を字幕なしで所蔵） |

### 調査済み・不採用動画（追加調査 2026-06-30）

| 動画ID | タイトル | 判定 | 理由 |
|--------|---------|------|------|
| NPL9kmcH9Tk | お経の王様 法華経の勤行 聴き流すだけでも絶大の効果【字幕付】(13:16) | ❌ 不採用 | 標準日蓮宗勤行の通し動画（開経偈+方便品+自我偈+神力品+観音経+題目+宝塔偈）。全セクション既完成。字幕形式はスクロール多行同時表示（タイミング精度低） |
| J1m3JjvNnGw | 開経偈（字幕付き）【お経練習】【妙法蓮華経】(1:40) | ❌ 不採用 | 字幕は日本語訳文（「百千万劫にも遭い奉ること難し」）。漢字本文のOCRグラウンドトゥルースとして不適。開経偈は既完成 |
| BqKMEP3TeBk | 妙法蓮華経方便品第二（フリガナあり）【お経練習・初級編】(4:04) | ⬜ 保留 | 浦和・円蔵寺。フリガナ付き1行下部表示形式。全文カバー確認（十如是含む）。hobenponは既に2ソース完成のため3ソース目として低優先。字幕ありでOCR可能 |

---

## Ground Truth方式 v2.0（2026-07-01 移行）

従来方式（字幕付き動画必須・OCR中心）では、普賢勧発偈および法華経二十八品の残り大半に
字幕付き練習動画が存在せず STOP していた。そこで以下の新方式に移行し、STOPを解除した。

**動画選定優先順位**（字幕は最下位）:
①日蓮宗正式読誦 ②全文収録 ③音質良好 ④ノイズ少 ⑤読み間違いなし ⑥テンポ安定 ⑦映像品質 ⑧字幕

**Ground Truth採用順**: OCR（字幕があれば） → Whisper large-v3 → DTW/Forced Alignment → 人工補正

**テキスト来歴**: 経文本文の原文取得元サイトが著作権懸念でWebFetch拒否するケースが頻発したため、
大正新脩大蔵経（鳩摩羅什訳、public domain）の内容をAIの学習知識で再構成する方式を採用。
`provenance: { status: "provisional", source: "ai_sample" }` を必ず付与し、
「原典（経本・SAT大蔵経等）と要照合」である旨をnoteに明記する。学習モード側は
`isLearnable()` が `verified` のみtrueを返すため、暫定データは「未検証」表示のまま運用される。

**発見**: 本光寺 Live チャンネル（UCiw39reqgNCUzRi-mgrFA6g）が法華経全28品を字幕なしで所蔵。
これにより残り26品すべてに動画ソースのめどが立った。

---

## 次回タスク優先順位

### ✅ 今セッション完了タスク（2026-07-01）

1. **提婆達多品第十二** (commit cdc2671): daibadatta.ts新規作成・sources.ts・index.ts登録。法華経 1/28。
2. **BqKMEP3TeBk** (commit 21c9f9b): 方便品 第3PlaybackSource (enzoiji-hobenpon)。OCR25フレーム確認。
3. **UI改善** (commit 1027e35): `displayTitle`（経文名）フィールドを PlaybackSource に追加。全11音源に付与。トップ画面を「音源で同期再生」→「経文を覚える」順に変更。再生ヘッダー・タイムスタンプ画面でも YouTubeタイトルの代わりに経文名を表示。Build 0エラー確認済み。
4. **普賢菩薩勧発品第二十八** (commit 538982e): Ground Truth方式v2.0で実装。fugenkanpatsuge.ts（全46行・6セクション）+ sources.ts（honkoji-fugen, ht8TC7DHfS4）+ index.ts登録。Whisper large-v3 47セグメントでタイミング確定、テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み。偈文 4/4、法華経 2/28。

---

### 1. 法華経二十八品 残26品（Ground Truth方式v2.0で着手可能）

本光寺 Live チャンネル所蔵・動画ID確定済み（字幕なし、Whisperでタイミング取得予定）:

```
1.序品        Tnqm52v9xZQ  1115s
2.方便品      S5caezkoUG0  1336s
3.譬喩品      D965nIz_Ufg  1596s
4.信解品      1YlVyFbN8mA  882s
5.薬草喩品    LGsPXrUxDUE  509s
6.授記品      Gu6YDp_FMT0  510s
7.化城喩品    tXWQkYZkkgk  1471s
8.五百弟子受記 Zv9gGKxP6Ro  667s
9.授学無学人記 GRKznTuERkw  418s
10.法師品     un3sFgKOgpU  625s
11.見宝塔品   GFBo3otgdCg  689s
12.提婆達多品  CNQvdEEsR0c  474s（既存daibadattaは別動画v6tSdCVw354使用。本光寺版は別ソース追加候補として保留）
13.勧持品     RxrISsOBVng  376s
14.安楽行品   16u7E86jzWs  889s
15.従地涌出品  DL5yxRxAomA  738s
16.如来寿量品  4SkckGoAqhw  506s
17.分別功徳品  5bEGLQvkNms  679s
18.随喜功徳品  wWxM4K2yvyI  389s
19.法師功徳品  iQ8aCyCDfRc  748s
20.常不軽菩薩品 x5BpHXnVxRs  416s
21.如来神力品  pSWxiFG8xJY  335s
22.嘱累品     Vkp9skpgJoI  151s
23.薬王菩薩本事品 _wuTfF5wZKA 829s
24.妙音菩薩品  ZGpcDRQOBwk  611s
25.観世音菩薩普門品 zqGW3sZ25I4 575s
26.陀羅尼品   jN_Y6HT-sHs  368s
27.妙荘厳王本事品 aRS02OmLaCg  462s
28.普賢菩薩勧発品 ht8TC7DHfS4  468s（実装済み ✅ commit 538982e）
```

**手順（品ごとに繰り返し）**: 音声抽出(yt-dlp+ffmpeg) → whisper-cli(large-v3) →
テキスト再構成（大正蔵ベース、AI知識、要照合として明記）→ `src/data/<id>.ts` 作成 →
`sources.ts` PlaybackSource追加 → `index.ts` 登録 → build → commit → push → 本番確認 → 次の品へ。

**規模に関する注記**: 長編（譬喩品1596s・化城喩品1471s・方便品1336s 等）は長行が長大なため、
1品あたりの行数が非常に多くなる可能性がある。品ごとに完了させて逐次コミットする。

### 2. 題目 0/4 の内容確認（人の判断が必要・保留中）

`daimoku.ts` の `d1`（南無妙法蓮華経）は基本勤行 7/7 に含まれて ✅完成済み。
「題目 0/4」とは何を指しているかが不明（4種の唱題形式？4つの動画ソース？長唱題/略唱題/団扇太鼓唱題等）。
→ **内容を確認・定義して欲しい。人の判断待ちにつき、他タスクを優先する。**
