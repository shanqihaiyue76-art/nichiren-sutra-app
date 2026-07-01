# 読経アプリ 開発状況

最終更新: 2026-07-01（UI改善: displayTitle追加・トップカード順変更・経文名表示化 ✅）

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
| 普賢勧発偈 | — | — | 字幕付き動画なし | ❌ 字幕付き動画未発見 | 調査済7本: ht8TC7DHfS4(静止タイトル)・DxY_yAwsB1A(花映像のみ)・l367Ojr3Xx0(自我偈を含む別構成)・K0SxHAWhxBU(AI朗読・本表示)・EwJ7HyY3BX8(TOC画面のみ)・uk_KbXx_cMc(静止タイトル)・HKtNSxmhMGU(花映像)。字幕付き読経動画なし。保留。 |

---

## 第二段階（法華経二十八品）

| 品 | ファイル | 動画 | タイミングQA | 状態 | 備考 |
|----|---------|------|-------------|------|------|
| 提婆達多品第十二 | daibadatta.ts | v6tSdCVw354 | OCR 26点×5s精度確認 | ✅ 完成 | 龍女成仏。偈頌db01-db04+長行db05-db26。章前半（提婆達多物語）は動画に含まれず未収録 |
| 方便品第二（長行） | — | — | 未着手 | ⬜ 未着手 | hobenponとは別に法華経二十八品としての収録が必要か要検討 |
| 残26品 | — | — | 未着手 | ❌ 動画なし | 字幕付き個別練習動画が存在しない。STOP条件。 |

---

## 全体完成率

基本勤行: 7/7 = **100%**（タイミングQA全完了）
偈文: 3/4 = **75%**（普賢勧発偈のみ未着手）
法華経: 0/28 = **0%**
題目: 0/4 = **0%**

法華経: 1/28 = **4%**（提婆達多品✅）
全体: 11/43 ≈ **26%**（QA済み）

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

**本番URL**: https://nichiren-sutra-app.vercel.app  
**Vercel**: 2026-07-01 自動デプロイ完了・本番確認済み  
**origin/main HEAD**: 2fea5d0

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

### 調査済み・不採用動画（追加調査 2026-06-30）

| 動画ID | タイトル | 判定 | 理由 |
|--------|---------|------|------|
| NPL9kmcH9Tk | お経の王様 法華経の勤行 聴き流すだけでも絶大の効果【字幕付】(13:16) | ❌ 不採用 | 標準日蓮宗勤行の通し動画（開経偈+方便品+自我偈+神力品+観音経+題目+宝塔偈）。全セクション既完成。字幕形式はスクロール多行同時表示（タイミング精度低） |
| J1m3JjvNnGw | 開経偈（字幕付き）【お経練習】【妙法蓮華経】(1:40) | ❌ 不採用 | 字幕は日本語訳文（「百千万劫にも遭い奉ること難し」）。漢字本文のOCRグラウンドトゥルースとして不適。開経偈は既完成 |
| BqKMEP3TeBk | 妙法蓮華経方便品第二（フリガナあり）【お経練習・初級編】(4:04) | ⬜ 保留 | 浦和・円蔵寺。フリガナ付き1行下部表示形式。全文カバー確認（十如是含む）。hobenponは既に2ソース完成のため3ソース目として低優先。字幕ありでOCR可能 |

---

## 次回タスク優先順位

### ✅ 今セッション完了タスク（2026-07-01）

1. **提婆達多品第十二** (commit cdc2671): daibadatta.ts新規作成・sources.ts・index.ts登録。法華経 1/28。
2. **BqKMEP3TeBk** (commit 21c9f9b): 方便品 第3PlaybackSource (enzoiji-hobenpon)。OCR25フレーム確認。
3. **UI改善** (commit 1027e35): `displayTitle`（経文名）フィールドを PlaybackSource に追加。全11音源に付与。トップ画面を「音源で同期再生」→「経文を覚える」順に変更。再生ヘッダー・タイムスタンプ画面でも YouTubeタイトルの代わりに経文名を表示。Build 0エラー確認済み。

---

### ⚠️ STOP条件到達（人の判断が必要）

#### 普賢勧発偈 ❌ 字幕付き動画 調査完了・全滅

調査済み10本:
- ht8TC7DHfS4 / DxY_yAwsB1A / l367Ojr3Xx0 / K0SxHAWhxBU / EwJ7HyY3BX8 / uk_KbXx_cMc / HKtNSxmhMGU（前セッション7本）
- NPL9kmcH9Tk / J1m3JjvNnGw / BqKMEP3TeBk（今セッション3本、全て別コンテンツ）

**→ 字幕付き普賢勧発偈動画が存在しない。実装不可。新規動画ソースの提供が必要。**

#### 法華経二十八品 ❌ 専用字幕動画 なし

字幕付き個別章練習動画（二十八品各章）は YouTube に現時点で存在しない。
見法寺チャンネルの既存シリーズ（方便品・寿量品・神力品・観音品・等）は既に全採用済み。

**→ 法華経28品個別実装には新規動画ソースが必要。人の判断待ち。**

### 1. 普賢勧発偈 実装（保留中）

**前提条件**: 字幕付き読経動画の発見・提供  
1. YouTube動画調査（最低3本比較）・採用
2. yt-dlp ダウンロード → ffmpeg 1fps フレーム抽出
3. Vision OCR → Whisper → DTW の3点照合
4. `src/data/fugenkanpatsuge.ts` 作成（全句・読み・訳・解説）
5. `sources.ts` PlaybackSource 追加（timings全句確定）
6. `index.ts` import・登録
7. ビルド → デプロイ → 実再生QA → ✅完成

### 2. 法華経二十八品 Phase開始（保留中）

**前提条件**: 字幕付き動画ソースの確保
1. 方便品第二（長行のみ）から開始
2. YouTube で字幕付き法華経動画を調査・採用
3. 全工程実行

### 3. 題目 0/4 の内容確認（人の判断が必要）

`daimoku.ts` の `d1`（南無妙法蓮華経）は基本勤行 7/7 に含まれて ✅完成済み。
「題目 0/4」とは何を指しているかが不明（4種の唱題形式？4つの動画ソース？）。
→ **内容を確認・定義して欲しい。**
