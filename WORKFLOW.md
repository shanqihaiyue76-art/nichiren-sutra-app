# WORKFLOW.md v5 — 完成フェーズ ワークフロー

対象読者: 実装担当（Sonnet）。この手順にそのまま従うこと。
運用ルールは [MASTER_SKILL.md](./MASTER_SKILL.md)、品質基準は [QA_GUIDELINES.md](./QA_GUIDELINES.md)、
進捗管理は [VERIFIED_STATUS.md](./VERIFIED_STATUS.md)、依頼テンプレは [SONNET_TEMPLATES.md](./SONNET_TEMPLATES.md)。

フェーズ: **完成・品質向上**（新規読経追加は原則終了。追加時のみ付録A参照）

---

## W1: 原典照合ワークフロー（provisional → verified）

1品ごとに以下を実施。1コミット=1品。

- [ ] 1. NTU全文PDF（T09n0262.pdf）が `.cache/` になければダウンロード
      https://buddhism.lib.ntu.edu.tw/FULLTEXT/sutra/chi_pdf/sutra4/T09n0262.pdf
- [ ] 2. 対象品の該当ページを特定し、テキスト抽出（pdftotext等。文字化け時はOCR）
- [ ] 3. `src/data/<id>.ts` の全行 `text` を原典と一字一句照合
      - 相違は原典に合わせて修正。`reading` も対応修正
      - 異体字（説/說・虚/虛 等）は**既存ファイルの表記慣例を優先**し、
        新規の判断が必要な場合のみ差分リストを報告して指示を待つ
      - 抄録ファイル（kannonhon=長行のみ 等）は収録範囲内のみ照合し、
        範囲をファイル冒頭コメントで再確認
- [ ] 4. 照合完了後 `provenance` を更新:
      `{ status: "verified", source: "taisho_t0262", note: "T0262原典照合済み（YYYY-MM-DD、NTU PDF）" }`
      ※ `source` の値は types.ts の型定義を確認し、なければ型拡張を先に1コミットで行う
- [ ] 5. 共通QA（下記W9）を全て実施
- [ ] 6. VERIFIED_STATUS.md の該当行を更新（同一コミットに含める）
- [ ] 7. commit: `fix(<id>): T0262原典照合・verified昇格`

## W2: タイミング精密化ワークフロー

- [ ] 1. 対象品の音声（`.cache/<id>.16k.wav`）の存在確認。なければ再取得（付録A-1）
- [ ] 2. 現行 timings と Whisper確認済みアンカーの乖離を確認
- [ ] 3. 手法の選択（優先順）:
      a. Whisperセグメント境界の目視再割当（低コスト・±2秒精度）
      b. DTW/Forced Alignment（aeneas等。`.venv-aeneas/` が存在する）
- [ ] 4. `/play/honkoji-<id>` で実再生し、行ハイライトと読誦のズレを確認
- [ ] 5. QA_GUIDELINES.md のタイミング基準（Level別）を満たすことを確認
- [ ] 6. 共通QA（W9）→ VERIFIED_STATUS.md 更新 → commit

## W3: UI改善ワークフロー

- [ ] 1. UI_DESIGN.md の該当項目の仕様を確認（なければ設計を先に依頼）
- [ ] 2. データ層（Sutra/PlaybackSource/buildTrack）は変更しない。
      必要なら理由を報告して指示を待つ
- [ ] 3. SSG前提を崩さない（`next build` で静的生成できること）
- [ ] 4. 実装 → preview検証: PC幅 + スマホ幅（375px）+ ダークモード（実装後）
- [ ] 5. 既存ページ全種（/, /sutra/, /memorize/, /test/, /play/）の回帰確認
      （1ページずつでよい。console errorゼロ）
- [ ] 6. 共通QA（W9）→ commit

## W4: バグ修正ワークフロー

- [ ] 1. 再現 → 原因特定（1行で報告）→ 最小差分で修正
- [ ] 2. 再現手順で解消確認 → 共通QA（W9）→ commit

## W9: 共通QAチェックリスト（全ワークフロー共通・完了の定義）

- [ ] `npx tsc --noEmit` エラー0
- [ ] `npm run build` 成功
- [ ] preview で該当ページ確認（console error 0 / failed request 0）
- [ ] `git add <変更ファイル明示>`（`-A` 禁止）→ commit → push
- [ ] GitHub HEAD 一致確認
- [ ] 本番URL反映確認（変更後の文字列をcurlで確認できるまで完了と言わない）
- [ ] VERIFIED_STATUS.md / PROJECT_STATUS.md / TODO.md の該当箇所更新
- [ ] 既知の落とし穴（SONNET_TEMPLATES.md末尾）を再確認

---

## 付録A: 新規経文追加（凍結中・参考）

新規追加はユーザー指示があった場合のみ。手順の要点:

1. **動画取得**: `yt-dlp -f bestaudio` → `ffmpeg -ar 16000 -ac 1` で16kHz wav化。
   ダウンロード直後に必ず `ffmpeg -af "silencedetect=noise=-35dB:d=5" -f null -`
   で全編の無音事前チェック
2. **Whisper**: 約200秒チャンクに分割し `whisper-cli -m models/ggml-large-v3.bin
   -l ja -oj` を**1チャンク=1Bashコールのフォアグラウンド実行**
   （長時間バックグラウンドはスリープで死ぬ・複数回確認済み）。
   マージはPythonでオフセット加算（`errors='replace'` 必須）
3. **定型句反復≠無音**: 動画中間で「ご視聴ありがとうございました」等が出たら
   volumedetect で音量確認。実は読誦中のことがある（信解品で確認済み）
4. **テキスト**: T0262知識ベース再構成 + `provenance: provisional/ai_sample`
5. **登録**: `src/data/<id>.ts` → sources.ts（「===== 方便品 初級練習動画」
   コメント直前に挿入）→ index.ts。行IDプレフィックスは全ファイルと衝突禁止
6. W9共通QAで完了
