import type { Sutra } from "./types";

/**
 * 題目（日蓮宗 朝夕勤行）
 *
 * 方便品・自我偈の読誦後に唱える「南無妙法蓮華経」。
 * 基準動画 _oN7QCtk3lk の 728〜870秒区間（唱題セクション）。
 *
 * Ground Truth:
 *   動画 YouTube _oN7QCtk3lk（朝夕の勤行 19分）の 740s 付近で
 *   【唱題】マーカー（P64）と右側テキスト「南無妙法蓮華経を 心ゆくまで お唱えします」
 *   が表示されることをフレーム抽出 + Vision OCR で確認。
 *
 *   動画は行ごとの字幕切り替えを行わず、唱題区間全体で静的テキストを表示する構成。
 *   チャント（南無妙法蓮華経）の音声開始は Whisper large-v3 で 728.3s と特定。
 *
 *   採用動画: YouTube _oN7QCtk3lk（朝夕の勤行 19分）
 *   採用理由: 既存の基準動画（方便品・自我偈で実績あり）。
 *             日蓮宗の読誦を全項目カバーし、字幕付き・音質良好・長期公開。
 *             題目区間（728-870s）の字幕はフレームOCR検証済み。
 *
 * タイミング（秒）は src/data/sources.ts の timings で管理する。
 */
export const daimoku: Sutra = {
  id: "daimoku",
  title: "題目",
  subtitle: "南無妙法蓮華経",
  provenance: {
    status: "provisional",
    source: "ocr_draft",
    note: "本文は動画フレームOCR（_oN7QCtk3lk 740s付近）で確認。動画は唱題区間全体で静的テキストを表示し行ごとの字幕切り替えなし。タイミングはWhisper large-v3による音声オンセット（728.3s）。",
  },
  sections: [
    {
      id: "shodai",
      title: "唱題",
      lines: [
        {
          id: "d1",
          text: "南無妙法蓮華経",
          reading: "なむみょうほうれんげきょう",
          translation: "妙法蓮華経に帰依申し上げます。",
          commentary:
            "日蓮宗の根本的な唱文（お題目）。「南無（なむ）」はサンスクリット語 namas に由来し「帰依する・敬礼する」の意。「妙法蓮華経」は法華経の題名。日蓮大聖人が全仏法の根幹と定め、唱えることで成仏できると説かれた。朝夕の勤行では方便品・自我偈の読誦後に唱える。",
        },
      ],
    },
  ],
};
