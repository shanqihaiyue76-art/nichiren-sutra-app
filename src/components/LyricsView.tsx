"use client";

import { useEffect, useRef } from "react";
import type { Track, TimedLine } from "@/lib/track";

interface Props {
  track: Track;
  /** フラット配列での現在行インデックス */
  activeIndex: number;
  /** 行タップ：翻訳表示 */
  onSelectLine: (line: TimedLine) => void;
  /** 行ダブルタップ：その行から再生（start未計測なら無視） */
  onSeekLine?: (flatIndex: number) => void;
}

export default function LyricsView({
  track,
  activeIndex,
  onSelectLine,
  onSeekLine,
}: Props) {
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const userScrollingRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 現在行を中央へ自動スクロール（手動スクロール中は一時停止）
  useEffect(() => {
    if (userScrollingRef.current) return;
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeIndex]);

  // 手動スクロール検知 → 3秒後に自動追従へ復帰
  const handleScroll = () => {
    userScrollingRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      userScrollingRef.current = false;
    }, 3000);
  };

  let prevSutraId = "";

  return (
    <div className="lyrics" onScroll={handleScroll}>
      <div className="lyrics-spacer" />
      {track.sections.map((section) => {
        const showSutraTitle = section.sutraId !== prevSutraId;
        prevSutraId = section.sutraId;
        return (
          <section key={section.key} className="section">
            {showSutraTitle && (
              <h2 className="sutra-divider">{section.sutraTitle}</h2>
            )}
            <h3 className="section-title">{section.sectionTitle}</h3>
            {section.lines.map((line) => {
              const isActive = line.flatIndex === activeIndex;
              return (
                <button
                  key={line.id}
                  ref={isActive ? activeRef : null}
                  className={`line ${isActive ? "line-active" : ""}`}
                  onClick={() => onSelectLine(line)}
                  onDoubleClick={() => onSeekLine?.(line.flatIndex)}
                >
                  <span className="line-text">{line.text}</span>
                  {line.reading && (
                    <span className="line-reading">{line.reading}</span>
                  )}
                </button>
              );
            })}
          </section>
        );
      })}
      <div className="lyrics-spacer" />
    </div>
  );
}
