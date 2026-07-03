# WORKFLOW.md — 品（章）実装の技術手順

法華経二十八品を1品実装するたびに、この手順を繰り返す。
運用ルール・STOP条件は [MASTER_SKILL.md](./MASTER_SKILL.md) を参照。

## 1. 動画取得

```bash
# 動画IDは TODO.md の確定済みリストを使用
yt-dlp -f bestaudio -o ".cache/<id>.%(ext)s" "https://www.youtube.com/watch?v=<videoId>"
ffmpeg -i ".cache/<id>.<ext>" -ar 16000 -ac 1 ".cache/<id>.16k.wav"
```

## 2. Whisper文字起こし（チャンク分割・フォアグラウンド必須）

長時間バックグラウンド実行は信頼できない（MASTER_SKILL.md参照）ため、
必ずチャンク分割 → フォアグラウンド実行の手順を踏む。

```bash
# 音声長を確認
ffprobe -v error -show_entries format=duration -of csv=p=0 ".cache/<id>.16k.wav"

# 約200秒ごとにチャンク分割
mkdir -p ".cache/<id>_chunks"
ffmpeg -i ".cache/<id>.16k.wav" -ss 0   -t 200 ".cache/<id>_chunks/chunk0.wav"
ffmpeg -i ".cache/<id>.16k.wav" -ss 200 -t 200 ".cache/<id>_chunks/chunk1.wav"
# ...以降200秒刻みで最後のチャンクまで（端数は残り秒数でOK）

# 各チャンクを「フォアグラウンドで1つずつ」実行（Bashツール1コール=1チャンク）
whisper-cli -m models/ggml-large-v3.bin -l ja -oj \
  -of ".cache/<id>_chunks/chunk0" ".cache/<id>_chunks/chunk0.wav"
# chunk1, chunk2, ... も同様に順番に実行する
# 並列化・バックグラウンド化は禁止。各コールは8〜10分以内に完了する想定。
```

マージ（オフセットを加算して1本のタイムラインに統合、Pythonワンライナー例）:

```python
import json

offsets = [0, 200, 400, 600, 800, 1000]  # チャンク数に合わせて調整
lines = []
for i, off in enumerate(offsets):
    data = json.load(open(f".cache/<id>_chunks/chunk{i}.json"))
    for seg in data["transcription"]:
        s = seg["offsets"]["from"] / 1000 + off
        e = seg["offsets"]["to"] / 1000 + off
        lines.append(f"[{s:8.1f} - {e:8.1f}] {seg['text'].strip()}")
open(".cache/<id>_merged.txt", "w").write("\n".join(lines))
```

マージ後、末尾に「ご視聴ありがとうございました」等のアウトロ／無音区間の
誤認識が含まれることが多い。実際の読誦終了時刻を見極め、それ以降は
データ化しない（例: 序品は動画1114sだが実質読誦は約0〜1023.5sで終了、
残りはアウトロの繰り返し誤認識）。

**重要**: 「ご視聴ありがとうございました」等の定型句反復＝無音、と
即断しないこと。信解品（1YlVyFbN8mA）では動画中間の200-400s・末尾の
800-881.8sがこの定型句として誤認識されたが、`ffmpeg -af volumedetect`
（3秒サンプル）で確認したところ mean_volume約-22dB・max_volume約-2.9dB
と全編ほぼ一定で、`silencedetect=noise=-35dB:d=5` でも無音区間は
検出されなかった。つまり実際には無音ではなく、旋律的・不明瞭な発声を
Whisperが認識できず定型句へフォールバックしたものだった。
→ 動画末尾以外の区間でこのパターンが出た場合は、必ず
`ffmpeg -i <file> -ss <t> -t 3 -af volumedetect -f null -` で
該当区間の音量を確認してから「無音（アウトロ）」か「認識失敗（実は
読誦中）」かを判断すること。動画末尾のみで出現する場合は、通常どおり
アウトロとして扱ってよい。

## 3. OCR（字幕がある動画の場合のみ・任意）

字幕焼き込み動画であれば1fpsフレーム抽出 + Vision OCRでアンカーを取り、
Whisperタイミングと突き合わせて精度を上げる。本光寺Liveチャンネルは
字幕なしのため、残りの品は基本Whisperのみで進める。

## 4. テキスト再構成

大正新脩大蔵経 T0262（鳩摩羅什訳、public domain）の内容を、Whisper
transcriptを構造的な手がかり（章立て・繰り返し箇所・固有名詞の当たり）
としながら、AIの学習知識で再構成する。逐語コピーではなく章の内容・
構成に忠実な再構成であること。

- 各行: `id`（品略号+連番）/ `text`（漢文）/ `reading`（ひらがな）/
  `translation`（現代語訳）
- 陀羅尼など音写のみで直訳不能な行は、無理に訳さず
  「（陀羅尼第◯部：〜の呪文）」等と説明的に記す（`fugenkanpatsuge.ts`参照）
- ファイル冒頭コメントにGround Truth動画情報・収録範囲・タイミング手法を明記
- `provenance: { status: "provisional", source: "ai_sample", note: "...要・原典照合" }`
  を必ず付与

`src/data/<id>.ts` として保存する。参考実装: `fugenkanpatsuge.ts`, `johon.ts`。

## 5. PlaybackSource登録

`src/data/sources.ts` の `sources` 配列に追加:

```ts
{
  id: "honkoji-<id>",
  displayTitle: "<品名>",
  title: "<動画タイトル>",
  subtitle: "本光寺 Live",
  kind: "youtube",
  youtubeId: "<videoId>",
  sutraIds: ["<id>"],
  timings: [
    { lineId: "<id>01", start: 0.0 },
    // ...Whisperセグメント開始時刻を各行に割り当てる
  ],
}
```

## 6. index.ts登録

```ts
import { <id> } from "./<id>";
// sutras配列に <id> を追加
```

## 7. ビルド・QA

```bash
npm run build   # TypeScriptエラー0・静的生成成功を確認
```

可能であればプレビューで `/sutra/<id>` と `/play/honkoji-<id>` を目視確認する。

## 8. Git / デプロイ

```bash
git add src/data/<id>.ts src/data/sources.ts src/data/index.ts
git commit -m "feat: <品名>を追加（<id>.ts + sources.ts + index.ts）"
git push origin main
```

push後、GitHubに反映されたこと・Vercelが自動デプロイしたこと・
本番URLで実際にページが表示されることを確認する。

## 9. ドキュメント更新

`PROJECT_STATUS.md` の該当テーブル・完成率・Git状態を更新し、
`TODO.md` から完了した品を除去（または✅に変更）して、次の品に着手する。
