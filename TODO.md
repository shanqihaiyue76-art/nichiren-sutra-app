# TODO.md — 読経アプリ 残タスク

運用ルールは [MASTER_SKILL.md](./MASTER_SKILL.md)、技術手順は
[WORKFLOW.md](./WORKFLOW.md)、実装済み内容・QA状況は
[PROJECT_STATUS.md](./PROJECT_STATUS.md) を参照。

最終更新: 2026-07-02

## 進行中

- [ ] **序品第一**（Tnqm52v9xZQ, 1114s、本光寺Live）
  - [x] 音声ダウンロード・16kHz変換
  - [x] Whisper large-v3 文字起こし（6チャンク・フォアグラウンド実行・完了）
  - [x] マージ済みトランスクリプト作成（`.cache/johon_merged.txt`、実質読誦は
        0〜約1023.5s、以降はアウトロの繰り返し誤認識のため除外）
  - [ ] `src/data/johon.ts` 作成（テキスト再構成）← 次のアクション
  - [ ] `sources.ts` に `honkoji-johon` PlaybackSource追加
  - [ ] `index.ts` 登録
  - [ ] ビルド確認
  - [ ] Git commit + push
  - [ ] GitHub/Vercel/本番確認
  - [ ] PROJECT_STATUS.md更新

## 次に着手（法華経二十八品 残り・本光寺Liveチャンネル所蔵・字幕なし）

動画IDは確定済み。各品ともWORKFLOW.mdの手順で実装する。序品完了後、上から順に進める。

```
2.方便品      S5caezkoUG0  1336s
3.譬喩品      D965nIz_Ufg  1596s
4.信解品      1YlVyFbN8mA  882s
5.薬草喩品    LGsPXrUxDUE  509s
6.授記品      Gu6YDp_FMT0  510s
7.化城喩品    tXWQkYZkkgk  1471s
8.五百弟子受記品 Zv9gGKxP6Ro  667s
9.授学無学人記品 GRKznTuERkw  418s
10.法師品     un3sFgKOgpU  625s
11.見宝塔品   GFBo3otgdCg  689s
12.提婆達多品  CNQvdEEsR0c  474s（既存daibadattaは別動画v6tSdCVw354使用。本光寺版は別ソース追加候補として保留）
13.勧持品     RxrISsOBVng  376s
14.安楽行品   16u7E86jzWs  889s
15.従地涌出品  DL5yxRxAomA  738s
16.如来寿量品  4SkckGoAqhw  506s
17.分別功徳品  5bEGLQvkNms  679s
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

完了済み: 1.序品（進行中・上記参照） / 28.普賢菩薩勧発品（✅ commit 538982e）

**規模の注記**: 譬喩品(1596s)・化城喩品(1471s)・方便品第二(1336s)は長行が
長大なため行数が多くなる見込み。1品ずつ完了させて逐次コミットする。

**方便品第二についての注記**: 既存 `hobenpon.ts` は基本勤行で使う十如是抜粋
（長行の一部＋十如是三返のみ）であり、法華経二十八品としてのフル収録とは別物。
「2.方便品」着手時に、新規ファイル名（例: `hobenpon-zenbun.ts` 等）にするか
既存ファイルとどう関係づけるかを決めてから進める。

## 保留中（人の判断待ち・着手しない）

- [ ] **題目 0/4** — 「題目0/4」が何を指すか不明（4種の唱題形式？4つの動画
  ソース？長唱題/略唱題/団扇太鼓唱題等？）。`daimoku.ts`のd1（南無妙法蓮華経）
  自体は基本勤行7/7に含まれ実装済み。→ **人に確認するまで着手しない。**
