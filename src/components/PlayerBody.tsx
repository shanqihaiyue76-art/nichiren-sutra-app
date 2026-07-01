"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Track, TimedLine } from "@/lib/track";
import { computeActiveIndex, hasTimings } from "@/lib/track";
import type { Transport } from "@/hooks/transport";
import LyricsView from "./LyricsView";
import PlayerControls from "./PlayerControls";
import TranslationSheet from "./TranslationSheet";

interface Props {
  track: Track;
  transport: Transport;
  /** 上部メディア領域（YouTube iframe など）。音声のみなら省略 */
  media?: React.ReactNode;
}

/**
 * 音源の種類に依らない再生画面の本体。
 * Transport（currentTime 等）から現在行を計算し、同期表示・操作・翻訳を束ねる。
 */
export default function PlayerBody({ track, transport, media }: Props) {
  const [selected, setSelected] = useState<TimedLine | null>(null);
  const { source } = track;

  const activeIndex = useMemo(
    () => computeActiveIndex(track.flatLines, transport.currentTime),
    [track.flatLines, transport.currentTime]
  );

  // 再生開始前（現在時刻が最初の計測行より前 = activeIndex が -1）でも、
  // 先頭の字幕をプレースホルダーとして中央表示し、上部の大きな空白をなくす。
  // 同期が始まれば（activeIndex >= 0）通常どおり現在行へ追従する。
  const displayIndex =
    activeIndex >= 0 ? activeIndex : track.flatLines.length > 0 ? 0 : -1;

  const seekToLine = (flatIndex: number) => {
    const line = track.flatLines[flatIndex];
    if (line && line.start != null) transport.seek(line.start);
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
        onSelectLine={setSelected}
        onSeekLine={seekToLine}
      />

      <PlayerControls
        isPlaying={transport.isPlaying}
        currentTime={transport.currentTime}
        duration={transport.duration}
        onTogglePlay={transport.togglePlay}
        onSeek={transport.seek}
      />

      <TranslationSheet line={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
