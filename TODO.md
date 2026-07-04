# TODO.md — 読経アプリ 残タスク

運用ルールは [MASTER_SKILL.md](./MASTER_SKILL.md)、技術手順は
[WORKFLOW.md](./WORKFLOW.md)、実装済み内容・QA状況は
[PROJECT_STATUS.md](./PROJECT_STATUS.md) を参照。

最終更新: 2026-07-04

## 進行中

- [ ] **分別功徳品第十七**（5bEGLQvkNms, 679s、本光寺Live）← 次のアクション
  - [ ] 動画取得・16kHz変換
  - [ ] 先にffmpeg silencedetectで無音区間の有無を確認しておく
  - [ ] Whisper large-v3 文字起こし（チャンク分割・フォアグラウンド実行、
        679sのため4チャンク程度を想定）
  - [ ] マージ済みトランスクリプト作成
  - [ ] 反復定型句が出た場合、動画末尾以外ではffmpeg volumedetectで
        無音か認識失敗かを必ず確認する（信解品以降の標準手順、
        WORKFLOW.md参照）
  - [ ] `src/data/funbetsukudokuhon.ts` 作成（テキスト再構成。久遠実成を
        聞いた大衆が得た様々な功徳・弥勒への長行と偈頌を含む）
  - [ ] `sources.ts` に PlaybackSource追加
  - [ ] `index.ts` 登録
  - [ ] ビルド確認
  - [ ] Git commit + push
  - [ ] GitHub/Vercel/本番確認（/playページはVercelエッジ伝播遅延で
        初回404の可能性あり。数秒後リトライすること）
  - [ ] PROJECT_STATUS.md更新

## 次に着手（法華経二十八品 残り・本光寺Liveチャンネル所蔵・字幕なし）

動画IDは確定済み。各品ともWORKFLOW.mdの手順で実装する。分別功徳品完了後、上から順に進める。
12.提婆達多品は既存`daibadatta.ts`（別動画v6tSdCVw354）で完成済みのためスキップ
（本光寺版CNQvdEEsR0cは別ソース追加候補として保留）。

```
18.随喜功徳品  wWxM4K2yvyI  389s
19.法師功徳品  iQ8aCyCDfRc  748s
20.常不軽菩薩品 x5BpHXnVxRs  416s
21.如来神力品  pSWxiFG8xJY  335s
22.嘱累品     Vkp9skpgJoI  151s
23.薬王菩薩本事品 _wuTfF5wZKA 829s
24.妙音菩薩品  ZGpcDRQOBwk  611s
25.観世音菩薩普門品 zqGW3sZ25I4 575s
26.陀羅尼品   jN_Y6HT-sHs  368s
27.妙荘厳王本事品 aRS02OmLaCg  462s
```

完了済み: 1.序品（✅ commit 09dc048） / 2.方便品第二・全文（✅ commit 906e988、
`hobenponzenbun.ts`） / 3.譬喩品（✅ commit bb0562f、`hiyuhon.ts`） /
4.信解品（✅ commit 1585d85、`shingehon.ts`） / 5.薬草喩品（✅ commit 3bf3a72、
`yakusoyuhon.ts`） / 6.授記品（✅ commit 5986624、`jukihon.ts`） /
7.化城喩品（✅ commit f6e273f、`kejohon.ts`） / 8.五百弟子受記品（✅ commit 730811f、
`gohyakuhon.ts`） / 9.授学無学人記品（✅ commit 8daa3fb、`jugakuhon.ts`） /
10.法師品（✅ commit 7687265、`hosshihon.ts`） / 11.見宝塔品（✅ commit c350f6f、
`hotohon.ts`） / 12.提婆達多品（✅ commit cdc2671、`daibadatta.ts`・別動画） /
13.勧持品（✅ commit a5c4e0f、`kanjihon.ts`） / 14.安楽行品（✅ commit 1b196ba、
`anrakugyohon.ts`） / 15.従地涌出品（✅ commit ecc6c36、`juchiyujutsuhon.ts`） /
16.如来寿量品（✅ commit 3da85fa、`juryohon.ts`） / 28.普賢菩薩勧発品（✅ commit 538982e）

**規模の注記**: 残る品の中では法師功徳品(748s)・薬王菩薩本事品(829s)が
やや長め。1品ずつ完了させて逐次コミットする。

## 保留中（人の判断待ち・着手しない）

- [ ] **題目 0/4** — 「題目0/4」が何を指すか不明（4種の唱題形式？4つの動画
  ソース？長唱題/略唱題/団扇太鼓唱題等？）。`daimoku.ts`のd1（南無妙法蓮華経）
  自体は基本勤行7/7に含まれ実装済み。→ **人に確認するまで着手しない。**
