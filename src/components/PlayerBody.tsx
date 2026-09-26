"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Track, TimedLine } from "@/lib/track";
import { computeActiveIndex, hasTimings } from "@/lib/track";
import type { Transport } from "@/hooks/transport";
import { getKeikoGuideBySource } from "@/data/keiko";
import LyricsView from "./LyricsView";
import PlayerControls, { type RepeatMode } from "./PlayerControls";
import TranslationSheet from "./TranslationSheet";
import KeikoSheet from "./KeikoSheet";

interface Props {
  track: Track;
  transport: Transport;
  /** 上部メディア領域（YouTube iframe など）。音声のみなら省略 */
  media?: React.ReactNode;
}

/** 1行くり返しで、次の行の頭よりこの秒数だけ手前で折り返す */
const LOOP_MARGIN = 0.1;

/**
 * 音源の種類に依らない再生画面の本体。
 * Transport（currentTime 等）から現在行を計算し、同期表示・操作・翻訳を束ねる。
 * くり返し再生（全体／1行）と、稽古の要点（keiko.ts に音源があるとき）もここで扱う。
 */
export default function PlayerBody({ track, transport, media }: Props) {
  const [selected, setSelected] = useState<TimedLine | null>(null);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [loopIndex, setLoopIndex] = useState<number | null>(null);
  const [repeatCount, setRepeatCount] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const { source } = track;

  const guide = useMemo(() => getKeikoGuideBySource(source.id), [source.id]);
  const cues = useMemo(() => {
    const byLine: Record<string, string> = {};
    for (const c of guide?.cues ?? []) byLine[c.lineId] = c.label;
    return byLine;
  }, [guide]);

  const activeIndex = useMemo(
    () => computeActiveIndex(track.flatLines, transport.currentTime),
    [track.flatLines, transport.currentTime]
  );

  // 再生開始前（現在時刻が最初の計測行より前 = activeIndex が -1）でも、
  // 先頭の字幕をプレースホルダーとして中央表示し、上部の大きな空白をなくす。
  // 同期が始まれば（activeIndex >= 0）通常どおり現在行へ追従する。
  const displayIndex =
    activeIndex >= 0 ? activeIndex : track.flatLines.length > 0 ? 0 : -1;

  // 1行くり返しの区間。終わり = 次に読まれる行の開始秒（最後の行なら音源の終わり）
  const loopRange = useMemo(() => {
    if (repeat !== "line" || loopIndex == null) return null;
    const line = track.flatLines[loopIndex];
    if (!line || line.start == null) return null;
    let end = Infinity;
    for (const l of track.flatLines) {
      if (l.start != null && l.start > line.start + 0.01 && l.start < end) end = l.start;
    }
    return { start: line.start, end: Number.isFinite(end) ? end : null };
  }, [repeat, loopIndex, track.flatLines]);

  // 1行くり返し: 次の行に入る手前で、その行の頭へ戻す
  const { currentTime, seek } = transport;
  useEffect(() => {
    if (!loopRange || loopRange.end == null) return;
    if (currentTime >= loopRange.end - LOOP_MARGIN) {
      seek(loopRange.start);
      setRepeatCount((c) => c + 1);
    }
  }, [currentTime, loopRange, seek]);

  // 最後まで再生して止まったとき: 全体くり返しは頭から、1行くり返し（最後の行）はその行から
  const { ended, togglePlay } = transport;
  useEffect(() => {
    if (!ended) return;
    const restartAt = repeat === "all" ? 0 : repeat === "line" ? loopRange?.start : undefined;
    if (restartAt == null) return;
    seek(restartAt);
    setRepeatCount((c) => c + 1);
    togglePlay();
    // 「止まった瞬間」だけに反応させる（モード切替では再生を始めない）
  }, [ended]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeRepeat = (mode: RepeatMode) => {
    setRepeat(mode);
    setRepeatCount(0);
    setLoopIndex(mode === "line" && displayIndex >= 0 ? displayIndex : null);
  };

  // シークしたら、1行くり返しの対象をその位置の行へ移す
  const seekTo = (time: number) => {
    transport.seek(time);
    if (repeat === "line") {
      const idx = computeActiveIndex(track.flatLines, time);
      setLoopIndex(idx >= 0 ? idx : 0);
      setRepeatCount(0);
    }
  };

  const seekToLine = (flatIndex: number) => {
    const line = track.flatLines[flatIndex];
    if (!line || line.start == null) return;
    transport.seek(line.start);
    if (repeat === "line") {
      setLoopIndex(flatIndex);
      setRepeatCount(0);
    }
  };

  return (
    <main className="player-page">
      <header className="player-header">
        <Link href="/" className="back-btn" aria-label="一覧へ戻る">
          ‹
        </Link>
        <div className="player-header-title">
          <span className="ph-title">{source.displayTitle}</span>
          {source.subtitle && <span className="ph-sub">{source.subtitle}</span>}
        </div>
        {guide && (
          <button
            type="button"
            className="header-pill"
            onClick={() => setGuideOpen(true)}
          >
            要点
          </button>
        )}
      </header>

      {media && <div className="media-area">{media}</div>}

      {!hasTimings(source) && (
        <div className="untimed-banner">
          この音源はタイミング未計測です。
          <Link href={`/capture/${source.id}`} className="untimed-link">
            作成ツールで同期を作る →
          </Link>
        </div>
      )}

      <LyricsView
        track={track}
        activeIndex={displayIndex}
        loopIndex={repeat === "line" ? loopIndex : null}
        cues={cues}
        onSelectLine={setSelected}
        onSeekLine={seekToLine}
      />

      <PlayerControls
        isPlaying={transport.isPlaying}
        currentTime={transport.currentTime}
        duration={transport.duration}
        onTogglePlay={transport.togglePlay}
        onSeek={seekTo}
        repeat={repeat}
        onChangeRepeat={changeRepeat}
        repeatCount={repeatCount}
      />

      <TranslationSheet line={selected} onClose={() => setSelected(null)} />
      {guide && (
        <KeikoSheet guide={guide} open={guideOpen} onClose={() => setGuideOpen(false)} />
      )}
    </main>
  );
}
