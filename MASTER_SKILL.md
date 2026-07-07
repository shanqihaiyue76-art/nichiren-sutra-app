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
自動化は [AUTO_PIPELINE.md](./AUTO_PIPELINE.md)。

## Git / Vercel デプロイ規則

「作業完了」を宣言できるのは、以下が全て完了した場合のみ:

1. TypeScriptエラー 0件
2. `npm run build` 成功
3. ローカルで動作確認
4. `git commit`
5. `git push`（許可されていれば自動実行。セキュリティ制限でブロックされた
   場合のみ、案内して一度だけ止まる）
6. GitHubへの反映確認
7. Vercel自動デプロイの確認
8. 本番URL（https://nichiren-sutra-app.vercel.app）での動作確認
9. PROJECT_STATUS.md 更新

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

## 品質チェックリスト（1品完成の定義）

- [ ] 全行に `text`（漢文）/ `reading`（ひらがな）/ `translation`（現代語訳）
- [ ] `provenance` を経文全体または行単位で明記（未照合なら`provisional`/`ai_sample`）
- [ ] タイミング（`timings`）が音源の実際の読誦と目視で違和感なく一致
- [ ] `npm run build` エラー0
- [ ] Git commit + push + GitHub反映確認
- [ ] Vercel本番デプロイ確認（該当ページが実際に表示される）
- [ ] PROJECT_STATUS.md / TODO.md 更新

## モデルについて

- 設計・改善: Claude（本ファイル冒頭のv4.0役割分担を参照）
- 実装・実行: Fable
