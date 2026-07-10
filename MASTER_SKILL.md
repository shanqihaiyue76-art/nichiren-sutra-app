# MASTER_SKILL.md — 読経アプリ マスタースキル v4.0

セッション開始時・再開時は必ずこのファイルを読み込むこと。

今後の再開プロンプトは以下で十分:
> PROJECT_STATUS.md / TODO.md / WORKFLOW.md / MASTER_SKILL.md を読んで続けて

## v4.0 役割分担（2026-07-06〜）

- **Claude（Sonnet等）= 設計者**: 設計改善・ワークフロー改善・スキル改善・
  TODO/PROJECT_STATUS整理・品質ゲート・命名・保守性のみ。出力は短く。
  改善案には必ず「優先度・効果・実装難易度」を付す。コードは擬似コードまで。
- **Fable = 実装者**: Whisper・OCR・動画DL・YouTube調査・Git操作・ビルド・
  コード生成・長時間処理・自動ループはすべてFableが実行する。
- Claudeは上記のFable作業を**実行禁止**。設計だけ提示する。
- 判断基準: 常に「この処理はFableへ回した方が効率的か」を先に考える。
- **設計文書は必ず該当コードを読んでから書く**（UI_DESIGN.md初版が実装未確認で
  誤りを含んだ教訓。2026-07-07 FINAL_REVIEW.mdで訂正済み）。

以下の「自律実行モード」「完了フロー」等は**Fableが実装時に従う規約**。
Claudeはこれらを改善する立場であり、自ら実行しない。

## ミッション

日蓮宗 読経アプリ（お経学習アプリ）の実装を継続する。
「基本勤行」「偈文」「法華経二十八品」「題目」の各データを、動画からの
Ground Truthに基づいて実装し、ビルド・デプロイまで完了させる。

## 運用モード：自律（Auto Mode）

- 1つのお経（品）が完成したら、人に確認を求めず自動で次のお経へ進む。
- 以下のSTOP条件に該当する場合のみ作業を止めて人に判断を仰ぐ:
  1. 動画なし（該当する品の動画がどうしても見つからない）
  2. OCR不可（字幕はあるが認識不能）
  3. Buildエラー（原因不明・自力で解決できない）
  4. Gitエラー（push等がブロックされ、案内しても解決しない）
  5. 著作権問題
  6. 人の判断が必要な事項（曖昧な要件等）
- それ以外は全て自律実行してよい。品質優先・妥協しない。

## Ground Truth方式 v2.0（2026-07-01〜）

**動画選定優先順位**（字幕の有無は最下位。字幕なし動画の採用を禁止しない）:
①日蓮宗正式読誦 ②全文収録 ③音質良好 ④ノイズ少 ⑤読み間違いなし
⑥テンポ安定 ⑦映像品質 ⑧字幕（最下位）

**動画探索の上限**: 最大15分 or 最大10本。字幕なしを理由に探索を止めない
→ 見つからなければそのままWhisper+DTW方式に進む。

**Ground Truth採用順**: OCR（字幕があれば）→ Whisper large-v3 →
DTW/Forced Alignment → 人工補正

**テキスト来歴の扱い**: 経文サイトは著作権懸念でWebFetchを拒否されるケースが多いため、
大正新脩大蔵経（鳩摩羅什訳・public domain）の内容をAIの学習知識で再構成する。
必ず `provenance: { status: "provisional", source: "ai_sample", note: "...要・原典照合" }`
を付与し透明性を保つ。`isLearnable()` は `status: "verified"` のみtrueを返すため、
暫定データは学習UI上「未検証」表示のままになる（＝誤った内容を確定事項として
学習者に暗記させない設計）。

## 完了フロー（1品ごとに繰り返す）

動画選定 → 保存 → 音声抽出 → Whisper → （字幕があればOCR）→ DTW/FA →
`src/data/<id>.ts` 作成 → `sources.ts` に PlaybackSource追加 →
`index.ts` に登録 → QA → ビルド → Git commit → push → デプロイ確認 →
PROJECT_STATUS.md / TODO.md 更新 → 次のお経へ自動移行。

詳細な技術手順は [WORKFLOW.md](./WORKFLOW.md)（v5・完成フェーズ用）。
残タスク・優先順位は [TODO.md](./TODO.md)。
実装済み内容・QA状況・Git履歴は [PROJECT_STATUS.md](./PROJECT_STATUS.md)。
実装依頼テンプレート・QAチェックリストは [SONNET_TEMPLATES.md](./SONNET_TEMPLATES.md)。
品質レベル定義は [QA_GUIDELINES.md](./QA_GUIDELINES.md)、
経文別完成度は [VERIFIED_STATUS.md](./VERIFIED_STATUS.md)、
UI改善は [UI_DESIGN.md](./UI_DESIGN.md)、性能・保守は [PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md)、
自動化は [AUTO_PIPELINE.md](./AUTO_PIPELINE.md)、
同期字幕の実装仕様は [SUBTITLE_DESIGN_SPEC.md](./SUBTITLE_DESIGN_SPEC.md)。

## Git / Vercel デプロイ規則

**「ローカル検証済み」は「作業完了」ではない。** ローカルのbuild/tsc/動作確認は
1サイクルの前半でしかなく、GitHub反映・Vercel Deployment成功・
Production URLでの実反映確認まで到達して初めて「完了」と宣言できる。
途中で報告を止める場合は「ローカル検証完了、GitHub/Vercel未確認」と
明示し、完了とは書かない。

「作業完了」を宣言できるのは、以下が全て完了した場合のみ:

1. TypeScriptエラー 0件
2. `npm run build` 成功
3. ローカルで動作確認
4. `git status` で差分を確認 → `git add`（対象ファイルを明示指定）
5. `git commit`
6. `git push origin main`（許可されていれば自動実行。セキュリティ制限で
   ブロックされた場合のみ、案内して一度だけ止まる）
7. GitHub最新コミットSHA確認（`git fetch` 後、`git rev-parse origin/main`
   がローカルHEADと一致することを確認。可能であれば `gh api` や
   Vercel APIのdeployment一覧でコミットSHAとの対応も確認）
8. Vercel Deployment成功・Production READY・Production PROMOTEDの確認
   （Vercel APIが使える場合はエンドポイントで確認。使えない場合は
   本番URLの実HTMLで代替確認する）
9. **本番URL（https://nichiren-sutra-app.vercel.app）で今回の変更が
   実際に反映されていることを確認。** 判定方法は必ず実際のページHTML
   （`curl`等で取得した本番出力）を対象に、変更後のみ存在するはずの
   具体的な文字列・要素を直接grepする。特定の`_next/static/chunks/`
   JSファイルのハッシュや内容だけでの判定は禁止
   （Next.js SSGはサーバー生成マークアップを静的HTMLに直接焼き込むため、
   JSチャンクの内容確認だけでは「反映されていない」と誤判定しうる。
   2026-07時点で実際にこの誤判定が発生し訂正した教訓）
10. Commit SHA・変更ファイル・Build/TypeCheck結果・GitHub反映確認・
    Vercel反映確認・Production確認・Console Errorをまとめて報告
11. PROJECT_STATUS.md 更新

## 既知の環境制約と回避策

**長時間バックグラウンド処理は信頼できない**: `run_in_background: true` や
`nohup ... & disown` による長時間（数分〜）のバックグラウンドプロセスは、
システムスリープや原因不明の理由でサイレントに死ぬことがある（複数回確認済み）。

→ **確立した回避策**: 長い音声はffmpegで約200秒ごとのチャンクに分割し、
`whisper-cli` を**チャンク単位でフォアグラウンド実行**する（各チャンクは
Bashツールの標準タイムアウト内＝8〜10分以内に完了）。全チャンク完了後、
Pythonスクリプトで時間オフセットを付けてJSON出力をマージする。
この方式を今後すべての品（章）に標準適用する（WORKFLOW.md参照）。

**ScheduleWakeupの遅延は信用しすぎない**: 要求した遅延秒数と実際の経過時間が
一致しないことがある。作業再開時は `date` コマンドで実時刻を必ず確認すること。

## 技術情報（要点）

- Next.js 15 SSGアプリ。本番: https://nichiren-sutra-app.vercel.app
- GitHub: https://github.com/shanqihaiyue76-art/nichiren-sutra-app.git
- データ層: `Sutra`（内容: text/reading/translation）と
  `PlaybackSource`（音源: タイミング）を分離。`buildTrack()`で結合。
- `whisper-cli`: `/opt/homebrew/bin/whisper-cli`、
  モデル `models/ggml-large-v3.bin`（3.09GB）。
  呼び出し: `-oj -of <basename>` → `<basename>.json` を出力。
- 本光寺 Live チャンネル（UCiw39reqgNCUzRi-mgrFA6g）: 法華経全28品を
  字幕なしで所蔵。残チャプター実装の動画ソースとして採用中。

## 字幕UX原則（2026-07-09 追加・永続ルール）

**大原則: 字幕は「表示できる量」ではなく「読める量」で設計する。**

基準は他アプリではなく**紙の経本**。紙の経本は1行が短く（十数字）、
行の区切りが呼吸と一致し、指で追える。アプリはこれより読みやすく・
追いやすく・覚えやすくなければ存在価値がない。

1. **詰め込まない**: 1表示単位は全角20字以内（目標16字前後）。
   1秒で視認できない量を1行に入れない。
2. **意味で切る**: 分割は 意味の切れ目 → 句読点（。＞、） → 読誦のリズム
   の優先順で決める。**時間だけを根拠に分割しない。**
3. **次が予測できる**: 現在行の前後が常に薄く見え、視線の行き先に迷わない。
4. **高齢者が追える**: 読誦速度（約3〜4字/秒）に対し1単位4〜6秒の
   自然な更新周期になる長さを保つ。1単位の表示が2秒を切る分割はしない。
5. **同期の優先順**: 字幕更新は 意味の区切り → 音声タイミング → 視認性
   の順で設計する。

実測（2026-07-09、全37経文・n=1167行、詳細はSUBTITLE_DESIGN_SPEC.md第0節）:
1行の平均43.5字・中央値41字・最長240字。20字超が77.5%。
読誦の実効速度はCPS中央値2.52（≒2.5字/秒）。
**現状データの大半がこの原則に違反しており、是正が必要。**
数値仕様・分割アルゴリズム・実施順は
[SUBTITLE_DESIGN_SPEC.md](./SUBTITLE_DESIGN_SPEC.md) v2（Sonnet実装用）が唯一の正。

### Subtitle QA（字幕を触るコミットの必須チェック）

- [ ] 20字超の行がない（音写のみ24字まで）
- [ ] CPS 8超がない（=タイミング異常）・6超は目視確認済み
- [ ] 表示2秒未満の単位がない
- [ ] 字幕領域が画面高さ60%以内
- [ ] 意味の途中・固有名詞の途中で分割していない
- [ ] 機能字（之而於者也）で始まる／（之而於）で終わる単位がない
- [ ] 文字サイズ「大」「特大」で1単位が折返し2行以内
- [ ] Android（Noto Serif JP）・iPhone（375px）両方で表示確認
- [ ] 高齢者（特大サイズ）で追える更新周期（1単位5〜8秒）
- [ ] 分割前後で本文結合が完全一致（欠落・重複ゼロ）

## 品質チェックリスト（1品完成の定義）

- [ ] 全行に `text`（漢文）/ `reading`（ひらがな）/ `translation`（現代語訳）
- [ ] `text` が1行20字以内（字幕UX原則。超える場合は意味の切れ目で分割）
- [ ] `provenance` を経文全体または行単位で明記（未照合なら`provisional`/`ai_sample`）
- [ ] タイミング（`timings`）が音源の実際の読誦と目視で違和感なく一致
- [ ] `npm run build` エラー0
- [ ] Git commit + push + GitHub反映確認
- [ ] Vercel本番デプロイ確認（該当ページが実際に表示される）
- [ ] PROJECT_STATUS.md / TODO.md 更新

## モデルについて

- 設計・改善: Claude（本ファイル冒頭のv4.0役割分担を参照）
- 実装・実行: Fable
