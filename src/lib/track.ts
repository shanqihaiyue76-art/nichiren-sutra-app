import type { PlaybackSource, SutraLine } from "@/data/types";
import { getSutra } from "@/data";

/**
 * ============================================================
 * 同期エンジン v1（凍結 / 2026-06-25）
 * ============================================================
 * 役割: 経文（内容層）＋音源タイミング → 再生用トラックの組立と
 *       「現在読まれている行」の算出。読経学習アプリにおける
 *       「同期表示」機能の中核であり、機能の一部として安定化させる。
 *
 * オフライン整列（タイムスタンプ生成）は Method A: Needleman-Wunsch
 * （scripts/generate-timings.mjs）。GT基準の精度PoC（凍結値）は
 * .cache/sync_engine_v1.json を参照。
 *
 * 本エンジンは v1 として固定する。後続改良（手法B: TTS-DTW、音韻NW
 * 強化版 = v2候補）は経本・正規かな読み入手後に別系統で評価し、
 * v1 の挙動は変更しない。
 */
export const SYNC_ENGINE_VERSION = "v1" as const;

/** 同期計算に使う、開始秒つきの行 */
export interface TimedLine extends SutraLine {
  /** フラット配列での通し番号 */
  flatIndex: number;
  /** 所属経文ID */
  sutraId: string;
  /** 開始秒。未計測なら null（自動ハイライト対象外） */
  start: number | null;
}

export interface TrackSection {
  /** 一意キー（経文ID + セクションID） */
  key: string;
  sutraId: string;
  sutraTitle: string;
  sectionTitle: string;
  lines: TimedLine[];
}

export interface Track {
  source: PlaybackSource;
  sections: TrackSection[];
  flatLines: TimedLine[];
}

/**
 * 音源の sutraIds を順に展開し、timings（lineId→start）を各行に適用して
 * 再生用トラックを組み立てる。複数経文が1本の音源として連結される。
 */
export function buildTrack(source: PlaybackSource): Track {
  const startByLineId = new Map<string, number>();
  for (const t of source.timings) startByLineId.set(t.lineId, t.start);

  const sections: TrackSection[] = [];
  const flatLines: TimedLine[] = [];
  let flat = 0;

  for (const sutraId of source.sutraIds) {
    const sutra = getSutra(sutraId);
    if (!sutra) continue;
    for (const section of sutra.sections) {
      const lines: TimedLine[] = section.lines.map((line) => {
        const timed: TimedLine = {
          ...line,
          flatIndex: flat++,
          sutraId: sutra.id,
          start: startByLineId.has(line.id)
            ? (startByLineId.get(line.id) as number)
            : null,
        };
        flatLines.push(timed);
        return timed;
      });
      sections.push({
        key: `${sutra.id}-${section.id}`,
        sutraId: sutra.id,
        sutraTitle: sutra.title,
        sectionTitle: section.title,
        lines,
      });
    }
  }

  return { source, sections, flatLines };
}

/**
 * 現在の再生秒から「いま読まれている行」のフラットインデックスを求める。
 * 現在行 = start が time 以下の行のうち、最も start が大きい行。
 * start が null の行（未計測）は無視する。
 */
export function computeActiveIndex(lines: TimedLine[], time: number): number {
  let idx = -1;
  let best = -Infinity;
  for (const line of lines) {
    if (line.start != null && line.start <= time + 0.05 && line.start >= best) {
      best = line.start;
      idx = line.flatIndex;
    }
  }
  return idx;
}

/** この音源にタイミングが1つでも入っているか */
export function hasTimings(source: PlaybackSource): boolean {
  return source.timings.length > 0;
}
