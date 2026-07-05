# TODO.md — 読経アプリ 残タスク

運用ルールは [MASTER_SKILL.md](./MASTER_SKILL.md)、技術手順は
[WORKFLOW.md](./WORKFLOW.md)、実装済み内容・QA状況は
[PROJECT_STATUS.md](./PROJECT_STATUS.md) を参照。

最終更新: 2026-07-05

## 🎉 法華経二十八品 実装完了（2026-07-05）

妙荘厳王本事品第二十七（commit fc35b0a）の完了をもって、法華経二十八品
すべての実装・ビルド・本番デプロイが完了した。「進行中」の自動継続タスクは
一旦ここで区切りとする。

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
16.如来寿量品（✅ commit 3da85fa、`juryohon.ts`） / 17.分別功徳品（✅ commit eec5d42、
`funbetsukudokuhon.ts`） / 18.随喜功徳品（✅ commit f84e7ca、`zuikikudokuhon.ts`） /
19.法師功徳品（✅ commit da1af6b、`hosshikudokuhon.ts`） / 20.常不軽菩薩品
（✅ commit a0a74ec、`jofukyohon.ts`） / 21.如来神力品（✅ commit a86847c、
`jinrikihon.ts`） / 22.嘱累品（✅ commit 6de91f6、`zokuruihon.ts`） /
23.薬王菩薩本事品（✅ commit 72fa368、`yakuohon.ts`） / 24.妙音菩薩品
（✅ commit 9ec606f、`myoonhon.ts`） / 25.観世音菩薩普門品（✅ commit 957f671、
`kannonhon.ts`） / 26.陀羅尼品（✅ commit 51b19e4、`daranihon.ts`） /
27.妙荘厳王本事品（✅ commit fc35b0a、`myoshogonnohon.ts`） / 28.普賢菩薩勧発品
（✅ commit 538982e）

## 今後（任意・優先度低）

法華経二十八品の実装自体は完了したが、以下は原典照合前の暫定データ
（`provenance.status: provisional`）のままであり、着手する場合は
人の判断・原典入手を要する:

- [x] （試験実施 2026-07-05）序品第一jo01「佛在王舍城」→「佛住王舍城」を
      Wikisource転載の大正新脩大蔵経T0262と照合し修正（commit a25ae06）。
      WebFetchは著作権ポリシー上125文字程度を超える逐語引用を拒否するため
      有名一節のスポットチェックのみ可能と判明。系統的な全28品照合には
      NTU仏学数位図書館のT0262全文PDF（1.6MB、buddhism.lib.ntu.edu.tw）の
      ダウンロードが必要と判断し、ユーザーに方針確認 → **「ここで一旦停止」を
      選択（2026-07-05）。ユーザーからの再開指示があるまで着手しない。**
- [ ] タイミングをDTW（動的時間伸縮）やOCR字幕データで精密化する
      （現状はWhisper確認済みアンカー＋均等補間による暫定配置）
- [ ] 提婆達多品（daibadatta.ts）の本光寺Live版（CNQvdEEsR0c）を
      別ソースとして追加するか検討する（現行は別動画v6tSdCVw354で完成済み）

## 保留中（人の判断待ち・着手しない）

- [ ] **題目 0/4** — 「題目0/4」が何を指すか不明（4種の唱題形式？4つの動画
  ソース？長唱題/略唱題/団扇太鼓唱題等？）。`daimoku.ts`のd1（南無妙法蓮華経）
  自体は基本勤行7/7に含まれ実装済み。→ **人に確認するまで着手しない。**
