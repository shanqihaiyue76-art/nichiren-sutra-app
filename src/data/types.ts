// ===== データ来歴・検証状態（学習アプリの正確性保証の中核） =====
//
// 学習アプリは「覚える内容」を提示する。読み・訳が誤っていれば誤った
// 読経をそのまま暗記させてしまう。そこで各データに検証状態を第一級の
// メタデータとして持たせ、UIが「未検証」を明示できるようにする。
// （⚠コメントによる注意書きを、機械可読なステータスへ昇格させたもの）

/**
 * 検証状態。学習者が「覚えてよい確定内容か」を判別するための第一級メタデータ。
 * 「どこ由来か（AI/OCR/経本）」は source 側で表す。status は検証レベルのみ。
 */
export type VerificationStatus =
  | "verified" // 一次資料（経本等）と人手で照合済み。学習提示可。
  | "provisional" // 暫定。出典確定前の作業用データ（差し替え前提）。
  | "unverified"; // 未検証。

/** データの出所。 */
export type SourceKind =
  | "keihon" // 正規経本（一次資料）
  | "ocr_draft" // 基準動画OCR（暫定）
  | "ai_sample" // モデル生成
  | "asr_whisper" // 音声認識（タイミング供給・補助。本文の典拠にはしない）
  | "manual" // 人手入力
  | "unknown";

/** 経文／行／音源など任意のデータ単位に付与する来歴情報。 */
export interface Provenance {
  /** 検証状態 */
  status: VerificationStatus;
  /** 出所 */
  source: SourceKind;
  /** 出典の説明（書名・動画ID・生成元など） */
  note?: string;
  /** 信頼度 0..1（OCR等で利用、任意） */
  confidence?: number;
  /** 最終確認日（ISO 8601・任意） */
  reviewedAt?: string;
}

/**
 * このデータを「学習提示してよいか」を判定する。
 * verified のみ true。未検証・AIサンプル・暫定は学習提示の前に検証が必要。
 */
export function isLearnable(p?: Provenance): boolean {
  return p?.status === "verified";
}

// ===== 内容層（タイミング情報を含まない） =====

export interface SutraLine {
  id: string;
  /** 経文本文（漢字） */
  text: string;
  /** よみ（ひらがな・ルビ用、任意） */
  reading?: string;
  /** 現代語訳 */
  translation: string;
  /** 仏教用語などの解説（任意。学習機能で使用） */
  commentary?: string;
  /** この行の来歴・検証状態（行単位で経文全体の値を上書きする場合・任意） */
  provenance?: Provenance;
}

export interface SutraSection {
  id: string;
  /** 例: 「長行」「偈頌」 */
  title: string;
  lines: SutraLine[];
}

export interface Sutra {
  /** 全経文で一意のID 例: "hobenpon" */
  id: string;
  /** 例: 「方便品」 */
  title: string;
  /** 副題 例: 「妙法蓮華経 方便品第二」 */
  subtitle?: string;
  /** 経文全体の来歴・検証状態（学習提示の可否判定に使う既定値） */
  provenance?: Provenance;
  sections: SutraSection[];
}

// ===== 音源層（再生方法＋タイミング） =====

/** 行ID → その行が読み始められる秒数 */
export interface LineTiming {
  lineId: string;
  start: number;
}

/**
 * 再生音源。1つの音源が複数の経文を順番に流す（例: 朝夕勤行 = 方便品→自我偈）。
 * タイミングは音源ごとに独立して持つため、同じ経文を別動画・別音声で
 * それぞれのタイミングで同期再生できる。
 */
export interface PlaybackSource {
  /** 音源ID（URL用） 例: "kingyo19" */
  id: string;
  /** UIに表示する経文名 例: "方便品第二"。一覧・再生ヘッダーに使う。 */
  displayTitle: string;
  /** YouTubeまたは内部タイトル（UIには表示しない。メタデータとして保持） */
  title: string;
  /** 補足（任意） */
  subtitle?: string;
  kind: "youtube" | "audio";
  /** kind="youtube" のとき: YouTube動画ID */
  youtubeId?: string;
  /** kind="audio" のとき: 音声ファイルのパス */
  audioUrl?: string;
  /** この音源が順に流す経文IDの並び 例: ["hobenpon", "jigage"] */
  sutraIds: string[];
  /**
   * 行ごとの開始秒。lineId で内容層の行に対応づける。
   * 空配列＝未計測（/capture ツールで作成する）。
   */
  timings: LineTiming[];
}

/** 全行をフラットに取得（内容層のみ） */
export function flattenLines(sutra: Sutra): SutraLine[] {
  return sutra.sections.flatMap((s) => s.lines);
}
