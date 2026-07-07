# SONNET_TEMPLATES.md — Sonnet実装用テンプレート集

Sonnetに実装を依頼するとき、該当テンプレートをコピペして `<>` を埋めるだけで使える。
共通ルール: 実装前に MASTER_SKILL.md / WORKFLOW.md / TODO.md を読むこと。
完了宣言は末尾の「QAチェックリスト」全項目✅が条件。

---

## T1: 原典照合（1品ずつ verified 昇格）

```
読経アプリ（/Users/miyachinaoki/僧侶の道/修行/読経アプリ/）で
<品名>（src/data/<id>.ts）の原典照合をして。

1. NTU仏学数位図書館のT0262全文PDF
   https://buddhism.lib.ntu.edu.tw/FULLTEXT/sutra/chi_pdf/sutra4/T09n0262.pdf
   （1.6MB, public domain）を .cache/ にダウンロード（未取得の場合のみ）
2. <品名>該当ページを抽出し、<id>.ts の全行 text と一字一句照合
3. 相違があれば text を原典に合わせて修正（reading も対応修正）。
   異体字（説/說 等）は現行ファイルの表記慣例に合わせ、判断に迷う場合のみ報告
4. 全行一致を確認後、provenance.status を "verified" に更新し、
   note に「T0262原典照合済み（照合日）」を記載
5. QAチェックリスト（SONNET_TEMPLATES.md 末尾）を全て実施
6. commit: 「fix(<id>): T0262原典照合・verified昇格」
```

## T2: 新規経文データ追加（今後の追加経典用）

```
読経アプリで <経文名> を実装して。動画: <videoId>（<チャンネル名>）。
WORKFLOW.md の手順1〜9に従うこと。要点:
- Whisperはチャンク分割・フォアグラウンド実行（バックグラウンド禁止）
- ダウンロード直後に ffmpeg silencedetect で全編の無音事前チェック
- 行IDプレフィックスは既存 src/data/ 全ファイルと衝突しない2-3字
- provenance: provisional / ai_sample を付与
- sources.ts への挿入位置: 「===== 方便品 初級練習動画」コメントの直前
完了条件: QAチェックリスト全✅
```

## T3: UI機能実装

```
読経アプリで <機能名> を実装して。

仕様: <設計書 or 箇条書き仕様>
対象: <対象ページ/コンポーネント>
制約:
- 既存のデータ層（Sutra / PlaybackSource / buildTrack）は変更しない
  （変更が必要なら実装前に理由を報告して指示を待つ）
- SSG前提を崩さない（Next.js 15 静的生成）
- 既存のスタイル・命名規則に合わせる
完了条件: QAチェックリスト全✅ + スマホ幅（375px）での表示確認
```

## T4: バグ修正

```
読経アプリのバグ修正: <症状>
再現手順: <手順>
期待動作: <期待>
修正前に原因を特定して1行で報告してから直すこと。
修正は最小差分。関係ないリファクタは同時に行わない。
完了条件: 再現手順で直ったことの確認 + QAチェックリスト全✅
```

## T5: ドキュメント更新のみ

```
読経アプリの <ファイル名> を更新して: <変更内容>
コード変更なし。更新後 cat で全文確認し、重複行・壊れたリンクがないこと。
commit: 「docs: <要約>」
```

---

## QAチェックリスト（実装完了の定義・全テンプレート共通）

コード変更を伴う場合:

- [ ] `npx tsc --noEmit` エラー0
- [ ] `npm run build` 成功
- [ ] preview で該当ページ表示確認（データ変更なら本文・行数、UI変更ならスマホ幅も）
- [ ] preview_console_logs（error）/ preview_network（failed）が空
- [ ] git add は**変更ファイルを明示指定**（`git add -A` 禁止。.vercel/ 等を混ぜない）
- [ ] commit → push → GitHub HEAD一致確認
- [ ] 本番URL（https://nichiren-sutra-app.vercel.app）で該当ページ表示・変更反映確認
  - 反映まで数十秒かかる。curlループで変更後の文字列を確認するまで完了と言わない
- [ ] PROJECT_STATUS.md（Git状態・履歴）/ TODO.md 更新・同一commitでpush

ドキュメントのみの場合:

- [ ] 更新後の全文を再読して重複・矛盾なし
- [ ] commit → push

## 既知の落とし穴（実装前に必ず認識すること）

1. **Whisperの定型句反復≠無音**。動画中間で出たら volumedetect で音量確認
2. **Whisper JSON に不正UTF-8バイト**が混入することがある
   → Python読み込みは `encoding='utf-8', errors='replace'`
3. **preview の YouTube サムネイルが黒く写る**ことがある
   → console/network にエラーがなければ iframe 遅延ロードであり不具合ではない
4. **yt-dlp の 403** は一時的。sleep 3 → リトライで解消することが多い
5. **Vercel /play/ 初回404** はエッジ伝播遅延。リトライで解消
