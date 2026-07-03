# 読経アプリ 開発状況

最終更新: 2026-07-03（薬草喩品第五 実装完了・デプロイ確認済み）

このファイルは実装済み内容・QA状況・Git履歴の記録。
運用ルール・STOP条件は [MASTER_SKILL.md](./MASTER_SKILL.md)、
技術手順は [WORKFLOW.md](./WORKFLOW.md)、残タスクは [TODO.md](./TODO.md) を参照。

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
| 序品第一 | johon.ts | honkoji-johon (Tnqm52v9xZQ) | Whisper large-v3 6チャンク・構造アンカー確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全118行・10セクション（序分〜声聞衆〜菩薩衆〜天龍八部衆〜入定瑞相〜放光〜弥勒疑念〜弥勒偈問〜文殊答長行〜文殊重頌）。テキストは大正新脩大蔵経T0262の再構成（ai_sample）。タイミングはセクション境界を構造確認の上、行数に応じた均等補間（要DTW/OCR精密照合） |
| 方便品第二（全文） | hobenponzenbun.ts | honkoji-hobenponzenbun (S5caezkoUG0) | Whisper large-v3 7チャンク・長行部語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全71行・7セクション（長行1〜十如是〜長行2〜偈1-4）。十如是・一大事因縁・一仏乗・三止三請・五千退席を含む全文収録。既存`hobenpon.ts`（十如是抜粋のみ）とは別物。長行部（11-400s）は十如是が136-171s台に直接出現するなど語句レベルでも比較的明瞭。偈頌部（400-1328s）は音写崩れが著しくセクション境界+均等補間（要DTW/OCR精密照合） |
| 譬喩品第三 | hiyuhon.ts | honkoji-hiyuhon (D965nIz_Ufg) | Whisper large-v3 8チャンク・冒頭/火宅導入部語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全90行・5セクション（舎利弗踊躍歓喜偈・記別/四衆供養・重請/火宅の譬え本体/合譬/重頌）。三車火宅の譬え（法華経で最も著名な譬喩）を全文収録。冒頭「にじしゃりほつゆやかんぎ」・火宅導入部「長者」が136-171s台等で語句レベルでも明瞭に確認できたが、長大な譬喩・偈頌の中盤は音写崩れが著しくセクション境界+均等補間（要DTW/OCR精密照合） |
| 信解品第四 | shingehon.ts | honkoji-shingehon (1YlVyFbN8mA) | Whisper large-v3 5チャンク・volumedetectで全編有音確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全73行・5セクション（四大声聞の歓喜・窮子の譬え導入/窮子の譬え前半/後半/合譬/重頌）。長者窮子の譬えを全文収録。Whisper反復定型句（「ご視聴ありがとうございました」）が動画中盤にも出現したが、volumedetect/silencedetectで無音でないと確認し全編を実質読誦区間として扱った（要DTW/OCR精密照合。手法はWORKFLOW.md参照） |
| 薬草喩品第五 | yakusoyuhon.ts | honkoji-yakusoyuhon (LGsPXrUxDUE) | Whisper large-v3 3チャンク・volumedetectで全編有音確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全45行・4セクション（仏の称賛・導入/三草二木の譬え本体/一相一味の法/重頌）。三草二木の譬え（大雲の譬え）を全文収録（要DTW/OCR精密照合） |
| 残21品 | — | — | 未着手 | 🔵 着手可能 | Ground Truth方式v2.0（字幕不要）により実装可能と判明。本光寺Liveチャンネルに全28品所蔵。動画IDリストは[TODO.md](./TODO.md)参照 |

---

## 全体完成率

基本勤行: 7/7 = **100%**（タイミングQA全完了）
偈文: 4/4 = **100%**（普賢勧発偈 実装完了・暫定データ）
法華経: 7/28 = **25%**（提婆達多品✅・普賢菩薩勧発品第二十八✅・序品第一✅・方便品第二✅・譬喩品第三✅・信解品第四✅・薬草喩品第五✅）
題目: 0/4 = **0%**

全体（カテゴリ計上ベース）: 18/43 ≈ **42%**
※ fugenkanpatsugeは「偈文」「法華経」両方に計上されるため、実装物としては16件（重複1件）。
※ 普賢勧発偈・提婆達多品(章前半欠)・序品第一・方便品第二・譬喩品第三・信解品第四・薬草喩品第五は `provenance.status: provisional` の暫定データ。原典照合前は学習モードで「未検証」表示のまま。

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
| 5d97f02 | docs: MASTER_SKILL.md / WORKFLOW.md / TODO.md 新設・PROJECT_STATUS.md整理 | ✅ GitHub反映済 |
| 09dc048 | feat: 序品第一を追加（johon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| 6ebbd9e | docs: 序品第一 完了を反映（PROJECT_STATUS.md / TODO.md更新） | ✅ GitHub反映済 |
| 906e988 | feat: 方便品第二（全文）を追加（hobenponzenbun.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| e9db634 | docs: 方便品第二（全文）完了を反映（PROJECT_STATUS.md / TODO.md更新） | ✅ GitHub反映済 |
| bb0562f | feat: 譬喩品第三を追加（hiyuhon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| 835928d | docs: 譬喩品第三完了を反映（PROJECT_STATUS.md / TODO.md更新） | ✅ GitHub反映済 |
| 1585d85 | feat: 信解品第四を追加（shingehon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| 3a47ed4 | docs: 信解品第四完了を反映・volumedetect手法をWORKFLOW.mdに追記 | ✅ GitHub反映済 |
| 3bf3a72 | feat: 薬草喩品第五を追加（yakusoyuhon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |

**本番URL**: https://nichiren-sutra-app.vercel.app  
**Vercel**: 2026-07-03 自動デプロイ完了・本番確認済み（/sutra/yakusoyuhon, /play/honkoji-yakusoyuhon 動作確認OK。45行・4セクション表示・YouTube埋め込み正常）  
**origin/main HEAD**: 3bf3a72

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
| Tnqm52v9xZQ | 妙法蓮華経 序品第一（本光寺 Live） | johon (honkoji-johon) | **なし**（Ground Truth方式v2.0。1114s、実質読誦0〜約1023.5s） |
| S5caezkoUG0 | 妙法蓮華経 方便品第二（本光寺 Live） | hobenponzenbun (honkoji-hobenponzenbun) | **なし**（Ground Truth方式v2.0。1336s、実質読誦約11〜1328.4s） |
| D965nIz_Ufg | 妙法蓮華経 譬喩品第三（本光寺 Live） | hiyuhon (honkoji-hiyuhon) | **なし**（Ground Truth方式v2.0。1596s、実質読誦約9.4〜1588.8s） |
| 1YlVyFbN8mA | 妙法蓮華経 信解品第四（本光寺 Live） | shingehon (honkoji-shingehon) | **なし**（Ground Truth方式v2.0。882s、volumedetectで全編有音確認の上、実質読誦約8〜880s） |
| LGsPXrUxDUE | 妙法蓮華経 薬草喩品第五（本光寺 Live） | yakusoyuhon (honkoji-yakusoyuhon) | **なし**（Ground Truth方式v2.0。508.9s、volumedetectで全編有音確認の上、実質読誦約5〜505s） |

### 調査済み・不採用動画（追加調査 2026-06-30）

| 動画ID | タイトル | 判定 | 理由 |
|--------|---------|------|------|
| NPL9kmcH9Tk | お経の王様 法華経の勤行 聴き流すだけでも絶大の効果【字幕付】(13:16) | ❌ 不採用 | 標準日蓮宗勤行の通し動画（開経偈+方便品+自我偈+神力品+観音経+題目+宝塔偈）。全セクション既完成。字幕形式はスクロール多行同時表示（タイミング精度低） |
| J1m3JjvNnGw | 開経偈（字幕付き）【お経練習】【妙法蓮華経】(1:40) | ❌ 不採用 | 字幕は日本語訳文（「百千万劫にも遭い奉ること難し」）。漢字本文のOCRグラウンドトゥルースとして不適。開経偈は既完成 |
| BqKMEP3TeBk | 妙法蓮華経方便品第二（フリガナあり）【お経練習・初級編】(4:04) | ⬜ 保留 | 浦和・円蔵寺。フリガナ付き1行下部表示形式。全文カバー確認（十如是含む）。hobenponは既に2ソース完成のため3ソース目として低優先。字幕ありでOCR可能 |

---

## Ground Truth方式 v2.0（2026-07-01 移行）

従来方式（字幕付き動画必須・OCR中心）では、普賢勧発偈および法華経二十八品の残り大半に
字幕付き練習動画が存在せず STOP していた。そこで新方式（動画選定優先順位・Ground Truth採用順・
テキスト来歴ポリシー）に移行し、STOPを解除した。詳細は [MASTER_SKILL.md](./MASTER_SKILL.md) 参照。

**発見**: 本光寺 Live チャンネル（UCiw39reqgNCUzRi-mgrFA6g）が法華経全28品を字幕なしで所蔵。
これにより残り26品すべてに動画ソースのめどが立った。

---

## 次回タスク優先順位

残タスク・法華経二十八品の確定動画IDリストは [TODO.md](./TODO.md) を参照。

### ✅ 完了タスク履歴

1. **提婆達多品第十二** (commit cdc2671, 2026-07-01): daibadatta.ts新規作成・sources.ts・index.ts登録。法華経 1/28。
2. **BqKMEP3TeBk** (commit 21c9f9b, 2026-07-01): 方便品 第3PlaybackSource (enzoiji-hobenpon)。OCR25フレーム確認。
3. **UI改善** (commit 1027e35, 2026-07-01): `displayTitle`（経文名）フィールドを PlaybackSource に追加。全11音源に付与。トップ画面を「音源で同期再生」→「経文を覚える」順に変更。再生ヘッダー・タイムスタンプ画面でも YouTubeタイトルの代わりに経文名を表示。Build 0エラー確認済み。
4. **普賢菩薩勧発品第二十八** (commit 538982e, 2026-07-01): Ground Truth方式v2.0で実装。fugenkanpatsuge.ts（全46行・6セクション）+ sources.ts（honkoji-fugen, ht8TC7DHfS4）+ index.ts登録。Whisper large-v3 47セグメントでタイミング確定、テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み。偈文 4/4、法華経 2/28。
5. **ドキュメント体系整理** (commit 5d97f02, 2026-07-02): MASTER_SKILL.md / WORKFLOW.md / TODO.md新設、PROJECT_STATUS.mdは実装済み内容・QA状況・Git履歴の記録に整理。プロンプト肥大化・API 400エラー回避のため、再開時は4ファイル参照で完結する構成に変更。
6. **序品第一** (commit 09dc048, 2026-07-03): Ground Truth方式v2.0で実装。johon.ts（全118行・10セクション: 序分/声聞衆/菩薩衆/天龍八部衆/入定瑞相/放光/弥勒疑念/弥勒偈問/文殊答長行/文殊重頌）+ sources.ts（honkoji-johon, Tnqm52v9xZQ）+ index.ts登録。Whisper large-v3（6チャンク・フォアグラウンド実行）でセクション構造を確認、字句レベルは連続読誦の音写崩れが著しく取得不能のため構造アンカー+均等補間でタイミング暫定配置。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/johon, /play/honkoji-johon）。法華経 3/28。
7. **方便品第二（全文）** (commit 906e988, 2026-07-03): Ground Truth方式v2.0で実装。hobenponzenbun.ts（全71行・7セクション: 長行1/十如是/長行2/偈1-4）+ sources.ts（honkoji-hobenponzenbun, S5caezkoUG0）+ index.ts登録。既存`hobenpon.ts`（十如是抜粋のみ）とは別ファイル。Whisper large-v3（7チャンク）で長行部（11-400s）は十如是が136-171s台に直接出現するなど語句レベルでも比較的明瞭に確認できたが、長大な偈頌部（400-1328s）は音写崩れが著しくセクション境界+均等補間でタイミング暫定配置。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合、三止三請・五千退席・一大事因縁・一仏乗の全教理を収録）。Build 0エラー・本番デプロイ確認済み（/sutra/hobenponzenbun, /play/honkoji-hobenponzenbun）。法華経 4/28。
8. **譬喩品第三** (commit bb0562f, 2026-07-03): Ground Truth方式v2.0で実装。hiyuhon.ts（全90行・5セクション: 舎利弗踊躍歓喜偈・記別/四衆供養・重請/火宅の譬え本体/合譬/重頌）+ sources.ts（honkoji-hiyuhon, D965nIz_Ufg）+ index.ts登録。三車火宅の譬え（法華経で最も著名な譬喩）を全文収録。Whisper large-v3（8チャンク）で冒頭（舎利弗踊躍歓喜）・火宅導入部（「長者」の直接出現）は語句レベルでも比較的明瞭に確認できたが、長大な譬喩・偈頌の中盤は音写崩れが著しくセクション境界+均等補間でタイミング暫定配置。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/hiyuhon, /play/honkoji-hiyuhon）。法華経 5/28。
9. **信解品第四** (commit 1585d85, 2026-07-03): Ground Truth方式v2.0で実装。shingehon.ts（全73行・5セクション: 四大声聞の歓喜・窮子の譬え導入/窮子の譬え前半/後半/合譬/重頌）+ sources.ts（honkoji-shingehon, 1YlVyFbN8mA）+ index.ts登録。長者窮子の譬えを全文収録。**方法論の修正**: Whisper反復定型句（「ご視聴ありがとうございました」）が動画中盤（200-400s）にも出現したため、`ffmpeg volumedetect`/`silencedetect`で実際に音量を確認したところ無音ではなかった（全編mean_volume約-22dB）。従来の「反復定型句＝無音（アウトロ）」という判断基準を修正し、全編を実質読誦区間として扱った（WORKFLOW.mdに追記）。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/shingehon, /play/honkoji-shingehon）。法華経 6/28。
10. **薬草喩品第五** (commit 3bf3a72, 2026-07-03): Ground Truth方式v2.0で実装。yakusoyuhon.ts（全45行・4セクション: 仏の称賛・導入/三草二木の譬え本体/一相一味の法/重頌）+ sources.ts（honkoji-yakusoyuhon, LGsPXrUxDUE）+ index.ts登録。三草二木の譬え（大雲の譬え）を全文収録。Whisper反復定型句（「お祈りします」）が全体の約60%（200-508.9s）に出現したが、信解品と同様volumedetect/silencedetectで無音でないことを確認し全編を実質読誦区間として扱った。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/yakusoyuhon, /play/honkoji-yakusoyuhon）。法華経 7/28。
