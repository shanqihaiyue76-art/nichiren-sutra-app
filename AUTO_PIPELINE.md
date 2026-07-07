# AUTO_PIPELINE.md — 自動化パイプライン設計

Sonnetが人の介在なしで完遂できる工程と、人の判断が必要な工程の切り分け。

## 工程別自動化マップ

| 工程 | 自動化度 | 現状 | 改善案 |
|------|---------|------|--------|
| 動画DL+音声抽出 | ●完全自動 | 手順確立済み | スクリプト化（fetch_audio.sh <videoId> <id>） |
| 無音事前チェック | ●完全自動 | 手順確立済み | 同上に組み込み |
| チャンク分割+Whisper | ●完全自動 | 1チャンク=1コール手動 | ループスクリプト化は不可（フォアグラウンド制約）。チャンク数算出+コマンド列生成のみ自動化 |
| Whisperマージ | ●完全自動 | 都度ワンライナー | scripts/merge_whisper.py として固定化 |
| OCR | ◐半自動 | daibadatta用スクリプトあり | scripts/ocr_daibadatta.py を汎用化（動画ID引数化） |
| テキスト再構成 | ◐半自動 | AI知識ベース | 原典PDF入手後は「PDF抽出→整形」に置換可能（精度向上+高速化） |
| 原典照合 | ◐半自動 | 未着手（PDF DL待ち） | scripts/verify_text.py 設計: PDF抽出テキストと<id>.tsのtext列を差分表示。人が差分だけ判断 |
| タイミング精密化 | ◐半自動 | 未着手 | aeneas等のFA実行は自動。最終目視は人/Sonnet |
| tsc+build | ●完全自動 | 手動実行 | pre-commitフック or scripts/qa.sh に統合 |
| preview検証 | ◐半自動 | Sonnetがpreviewツールで実施 | 検証項目はW9で固定済み。console/network確認は機械的 |
| Git add/commit/push | ●完全自動 | Sonnet実施 | コミットメッセージ規約済み。qa.sh成功を前提条件に |
| GitHub/Vercel確認 | ●完全自動 | curlループ確立済み | scripts/verify_deploy.sh <path> <expected_string> |
| ドキュメント更新 | ●完全自動 | Sonnet実施 | VERIFIED_STATUS.mdの表形式により機械的更新が可能に |

## 人の判断が必要な工程（自動化しない）

1. 異体字の表記方針（説/說 等）— 初回に方針決定すれば以後は機械適用可
2. 抄録範囲の決定（長行のみ/偈のみ等の収録方針）
3. 品質レベルの A 認定（最終的な目視確認）
4. 新規動画の採用可否（著作権・品質の総合判断）
5. UI/UXの意匠決定

## 推奨スクリプト整備（実装はSonnet・優先順）

1. `scripts/qa.sh` — tsc→build→（引数でcurl本番確認）を1コマンド化。
   効果: W9の3項目が1回で終わる。難易度: 低
2. `scripts/verify_text.py` — 原典照合の差分表示。
   効果: W1の工数を1品30分→5分へ。難易度: 中（PDF抽出精度に依存）
3. `scripts/merge_whisper.py` — 既存ワンライナーの固定化。難易度: 低
4. `scripts/verify_deploy.sh` — デプロイ確認curlループの固定化。難易度: 低

## 全自動運転の完成形（目標像)

「<品名>を原典照合して」の一言で:
qa.sh前提の環境で verify_text.py が差分提示 → 差分ゼロor機械的修正なら
そのままverified昇格 → qa.sh → commit/push → verify_deploy.sh →
VERIFIED_STATUS.md更新まで無停止。人が見るのは差分リストの例外のみ。
