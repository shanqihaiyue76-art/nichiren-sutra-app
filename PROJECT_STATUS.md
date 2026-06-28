# 読経アプリ 開発状況

最終更新: 2026-06-28（QA実施・回向文再同期）

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
| 神力偈 | jinrikige.ts | I9KKyj0BDOI | **OCR不可** | ❌ 動画変更候補あり | 採用動画に字幕オーバーレイなし（タイトルカード静止のみ）。現タイミング(140s〜,2s/行)は純補間で未検証 |
| 観音偈 | kannonge.ts | _CyvlLqEWUs | OCRアンカー14点(118句中) | ⚠️ 要再同期 | ko1〜ko104の偈頌部でアンカー間隔最大35句。補間精度要改善。追加OCR取得が必要 |
| 普賢勧発偈 | — | — | 未着手 | ⬜ 未着手 | |

---

## 第二段階（法華経二十八品）

未着手

---

## 全体完成率

基本勤行: 7/7 = **100%**（タイミングQA全完了）
偈文: 1/4 = **25%**（神力偈・観音偈QA未完了）
法華経: 0/28 = **0%**
題目: 0/4 = **0%**

全体: 8/43 ≈ **19%**（QA済み）

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
| .cache/jinriki_frames/ | 神力偈フレーム3枚（タイトルカードのみ・字幕なし確認済み） |
| .cache/jinriki_I9KKyj0BDOI.16k.wav | 神力偈音声（WAV） |
| .cache/hotoge_whisper.json | 宝塔偈Whisper（3セグメント・「お祈りします」のみ、タイミング用途なし） |

---

## 採用動画一覧

| 動画ID | タイトル | 用途 | 字幕 |
|--------|---------|------|------|
| _oN7QCtk3lk | 朝夕の勤行（19分）| kaikyoge/hobenpon/jigage/daimoku/ekomon-chogyo/shishi | あり（スクロール蓄積型） |
| XivPWmWJO2c | ゆっくり読む日蓮宗のお経【15分】(長崎県日蓮宗青年会) | hotoge | あり |
| I9KKyj0BDOI | 日蓮宗 お経 妙法蓮華経 如来神力品第二十一 | jinrikige（要変更） | **なし** |
| _CyvlLqEWUs | 観音経 慈悲と救いであらゆる願いが叶う偈文・7分 字幕（高野山真言宗 松島龍戒） | kannonge（要追加OCR） | あり |

---

## 次回タスク優先順位

### 1. 神力偈 動画差し替え（❌ → ✅）

1. YouTube で「如来神力品第二十一」字幕付き動画を調査
2. yt-dlp でダウンロード → `.cache/jinriki2_*/`
3. ffmpeg 1fps フレーム抽出 → OCR
4. Whisper処理 → 3点照合
5. `jinrikige.ts` タイミング更新 + `sources.ts` 差し替え
6. ビルド → デプロイ

### 2. 観音偈 追加OCRアンカー（⚠️ → ✅）

1. `.cache/kannon_frames_1fps/` から中間域(ko30〜ko80相当)フレームを追加読み取り
2. 現補間値との誤差確認。アンカー密度を高める
3. `sources.ts` の kannon-CyvlL タイミング修正
4. ビルド → デプロイ

### 3. 普賢勧発偈 実装（⬜ → ✅）

1. YouTube動画調査・採用
2. 動画調査→OCR→Whisper→DTW→実装→QA→デプロイ の全工程
