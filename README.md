# 読経練習アプリ

日蓮宗の読経を「聞きながら見て覚える」ための個人用アプリ。
YouTube Music の歌詞表示のように、音声と経文を同期ハイライト表示し、
行をタップすると現代語訳をボトムシートで確認できます。

## 起動

```bash
npm install
npm run dev
# http://localhost:3000
```

スマホ表示前提（縦長・タップ操作）。PC のブラウザでも動作します。

## スマホ実機で開く

Mac とスマホを **同じ Wi-Fi** につないだうえで、Mac 側で次を実行します。

```bash
npm run dev:mobile
```

起動すると、ターミナルにアクセス先 URL が表示されます。

```
  ローカル : http://localhost:3000
  スマホ用 : http://10.1.11.175:3000   ← スマホのブラウザでこれを開く
```

- 表示される IP（例 `10.1.11.175`）は **起動時に自動検出** されます。
  ネットワークが変わると IP も変わるため、毎回ターミナルの表示を確認してください。
- スマホの Safari / Chrome のアドレスバーに `http://（表示された IP）:3000` を入力して開きます。
- `qrcode-terminal` を入れておくと QR コードも表示されます（任意）。
  ```bash
  npm install -D qrcode-terminal
  ```

### つながらないとき

- **同じ Wi-Fi か確認** … Mac とスマホが別ネットワーク（ゲスト Wi-Fi 等）だと接続できません。
- **macOS のファイアウォール** … 「システム設定 → ネットワーク → ファイアウォール」が
  オンの場合、初回アクセス時に Node の受信許可を求められることがあります。許可してください。
- **IP を再確認** … スリープ復帰や回線切替で IP が変わることがあります。
  `npm run dev:mobile` を起動し直すと最新の IP が表示されます。

### ホーム画面に追加（アプリ風に使う）

- **iPhone (Safari)** … 共有ボタン → 「ホーム画面に追加」。
  アイコンから起動するとアドレスバーのない全画面（スタンドアロン）表示になります。
- **Android (Chrome)** … メニュー → 「ホーム画面に追加」。

> 補足: 同一 Wi-Fi の `http://` 接続では Service Worker（オフライン
> キャッシュ）は動きません（ブラウザの仕様上、`https`／`localhost` のみ有効）。
> ホーム画面アイコン・全画面表示・テーマ色は `http` でも有効です。

## 画面

- **ホーム** … 経文の一覧。タップで再生画面へ。
- **再生画面** … 中央に現在の行をハイライト表示し、再生に合わせて自動スクロール。
  - 行を **タップ** → 現代語訳をボトムシート表示
  - 行を **ダブルタップ** → その行の頭から再生
  - 下部に 再生/停止・シークバー・経過/全体時間

## 経文を追加する

1. `src/data/` に新しいデータファイルを作る（`hobenpon.ts` を参考に）。
2. `src/data/index.ts` で import して `sutras` 配列に追加。

```ts
// src/data/index.ts
import { newSutra } from "./newSutra";
export const sutras = [hobenpon, jigage, newSutra];
```

データ構造（`src/data/types.ts`）:

```ts
Sutra   { id, title, subtitle?, audioUrl, sections[] }
Section { id, title, lines[] }
Line    { id, text, reading?, translation, start }  // start = 読み始めの秒数
```

## 音声ファイルについて

`public/audio/*.wav` は **動作確認用の無音プレースホルダー** です。

実際の読経音声を使うには:

1. 録音ファイル（mp3 / m4a / wav いずれも可）を `public/audio/` に置く。
2. 対応するデータファイルの `audioUrl` をそのパスに変更する。
3. 各行の `start` を、実際にその行を読み始める秒数に合わせて調整する。

> タイムスタンプ調整のコツ: 再生しながら各行の開始位置の秒数をメモし、
> `start` に入れていくと同期がそろいます。
