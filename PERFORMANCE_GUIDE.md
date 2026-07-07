# PERFORMANCE_GUIDE.md — 性能・保守性ガイド

読経数が増えても高速動作・高保守性を保つための設計方針。

## 現状評価

- SSG（全ページ静的生成）のため実行時性能は既に良好。First Load JS 約102-109kB
- 最大の負債は **sources.ts 2534行の単一ファイル**（実行性能ではなく保守性の問題）
- 全経文データが全ページのJSバンドルに含まれるかは要計測（下記P2）

## P1: sources.ts 分割設計（優先度: 高 / 効果: 保守性大 / 難易度: 中）

現状: 全PlaybackSourceが1ファイル。1品の編集でも2534行を扱い、
挿入位置をコメントアンカーに依存している。

提案構成:

```
src/data/sources/
  index.ts            # 各ファイルをimportして sources 配列に集約。
                      # 既存の export { sources, getSource } を維持（呼び出し側は無変更）
  honkoji/            # 本光寺Live系（28品）
    johon.ts          # export const honkojiJohon: PlaybackSource = {...}
    hiyuhon.ts        # 1品=1ファイル
    ...
  gongyo/             # 基本勤行系音源
  practice/           # 練習動画系（浦和円蔵寺等）
```

移行ルール:
- 機械的な切り出しのみ。timings等の値は1文字も変えない
- 1コミットで完結（分割+index集約+旧sources.ts削除）
- 検証: 分割前後で `sources` 配列のJSON出力が完全一致することをスクリプトで確認
  （並び順も含めて一致させる）
- コメントアンカー「===== 方便品 初級練習動画」ルールは廃止し、
  「新規はディレクトリにファイル追加+index1行」に置き換え（WORKFLOW付録A修正も同時に）

## P2: バンドル計測と経文データの遅延化（優先度: 中 / 難易度: 中）

- まず `next build` の First Load JS を計測し、全経文データ（37ファイル+timings）が
  共有チャンクに入っていないか確認する
- 入っている場合: 一覧ページは軽量メタデータ（id/title/行数のみ）を使い、
  本文+timingsは各 `/sutra/[id]` ページでのみ import する構成へ
  （SSGなので generateStaticParams + ページ単位import で自然に分割される）
- 経文数が50を超えたあたりで必須になる見込み。37の現状では任意

## P3: その他（優先度: 低）

- YouTube IFrame: `loading="lazy"` + facade（サムネイルクリックで初めてiframe生成）
  → /play/ 初期表示の体感改善
- 画像・フォント: 経文表示用フォントをサブセット化する場合は品質確認を必須に
- localStorage肥大: 学習履歴はキー設計を `progress:<sutraId>` 単位にし、
  一括JSON1キーにしない（既にそうなっているか要確認）

## 計測の習慣

UI変更を伴うコミットでは `next build` 出力の First Load JS を確認し、
+10kB以上増えた場合は理由をコミットメッセージに書くこと。
