# 読経アプリ 開発状況

最終更新: 2026-06-28

---

## 完成状況

### 第一段階（基本勤行）7/7 ✅ 完成

| 読経 | ファイル | 動画 | 行数 | 状態 |
|------|---------|------|------|------|
| 開経偈 | kaikyoge.ts | kingyo19 (_oN7QCtk3lk) | 14行 | ✅ |
| 方便品第二 | hobenpon.ts | kingyo19 (_oN7QCtk3lk) | 25行+十如是3回 | ✅ |
| 自我偈 | jigage.ts | kingyo19 (_oN7QCtk3lk) | 26行 | ✅ |
| 題目 | daimoku.ts | kingyo19 (_oN7QCtk3lk) | 1行 | ✅ |
| 回向文 | ekomon-chogyo.ts | kingyo19 (_oN7QCtk3lk) | 39行 | ✅ |
| 宝塔偈 | hotoge.ts | kyushu-hotoge (XivPWmWJO2c) | 24行 | ✅ |
| 四誓（四弘誓願） | shishi.ts | kingyo19 (_oN7QCtk3lk) | 4行 | ✅ |

---

### 第二段階（法華経二十八品）0/28

未着手

---

### 第三段階（各種偈）1/4

| 偈文 | 状態 | 動画 |
|------|------|------|
| 宝塔偈 | ✅ 完成 | XivPWmWJO2c |
| 神力偈 | 🔄 実装中 | 調査中 |
| 観音偈 | ⬜ 未着手 | — |
| 普賢勧発偈 | ⬜ 未着手 | — |

---

### 第四段階（題目バリエーション）0/4

未着手

---

## 全体完成率

基本勤行: 7/7 = **100%**
偈文: 1/4 = **25%**
法華経: 0/28 = **0%**
題目: 0/4 = **0%**

全体: 8/43 ≈ **19%**

---

## キャッシュ済みデータ

| キャッシュ | 内容 |
|-----------|------|
| .cache/_oN7QCtk3lk.video.mp4 | 朝夕の勤行19分（kingyo19） |
| .cache/_oN7QCtk3lk.whisper.json | Whisper large-v3 全文 |
| .cache/XivPWmWJO2c（hotoge_survey/） | ゆっくり読む15分（宝塔偈） |
| .cache/hotoge_frames/ | 宝塔偈 1fps フレーム |
| .cache/shishi_frames/ | 四誓 1fps フレーム（1048-1082s） |
| .cache/kaikyoge_frames/ | 開経偈フレーム |
| .cache/ekomon_frames/ | 回向文フレーム |
| .cache/frames_jigage/ | 自我偈フレーム |

---

## 採用動画一覧

| 動画ID | タイトル | 用途 |
|--------|---------|------|
| _oN7QCtk3lk | 朝夕の勤行（19分）| kaikyoge/hobenpon/jigage/daimoku/ekomon-chogyo/shishi |
| XivPWmWJO2c | ゆっくり読む日蓮宗のお経【15分】(長崎県日蓮宗青年会) | hotoge |

---

## 次回開始地点

**次のタスク: 神力偈**（第三段階 偈文②）

1. YouTube動画調査・採用
2. yt-dlp でダウンロード → `.cache/jinriki_*/`
3. ffmpeg 1fps フレーム抽出 → OCR
4. Whisper 必要区間のみ
5. `src/data/jinrikige.ts` 作成
6. `sources.ts` に PlaybackSource 追加
7. `index.ts` に import・登録
8. `npm run build` → git push → Vercel確認
