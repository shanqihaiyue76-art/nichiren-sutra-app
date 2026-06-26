"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Track } from "@/lib/track";
import type { Transport } from "@/hooks/transport";

interface Props {
  track: Track;
  transport: Transport;
  media?: React.ReactNode;
}

type TimingMap = Record<string, number>;

function storageKey(sourceId: string) {
  return `dokyo:timings:${sourceId}`;
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(1).padStart(4, "0");
  return `${m}:${s}`;
}

/**
 * タイムスタンプ作成ツールの本体。
 * 動画を再生しながら「マーク」で現在行に再生秒を記録し、次行へ進む。
 * 結果は localStorage に下書き保存し、JSON で出力して sources.ts に貼る。
 */
export default function CaptureBody({ track, transport, media }: Props) {
  const { source } = track;
  const lines = track.flatLines;

  const [timings, setTimings] = useState<TimingMap>({});
  const [cursor, setCursor] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  // 初期ロード: 既存 timings → localStorage の下書きで上書き
  useEffect(() => {
    const base: TimingMap = {};
    for (const t of source.timings) base[t.lineId] = t.start;
    try {
      const raw = localStorage.getItem(storageKey(source.id));
      if (raw) Object.assign(base, JSON.parse(raw) as TimingMap);
    } catch {
      /* noop */
    }
    setTimings(base);
    setLoaded(true);
  }, [source]);

  // 変更を下書き保存
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey(source.id), JSON.stringify(timings));
    } catch {
      /* noop */
    }
  }, [timings, loaded, source.id]);

  // 現在カーソル行を画面内へ
  useEffect(() => {
    cursorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [cursor]);

  const mark = useCallback(() => {
    const line = lines[cursor];
    if (!line) return;
    const t = Math.round(transport.currentTime * 10) / 10;
    setTimings((prev) => ({ ...prev, [line.id]: t }));
    setCursor((c) => Math.min(c + 1, lines.length));
  }, [cursor, lines, transport]);

  const back = useCallback(() => setCursor((c) => Math.max(0, c - 1)), []);
  const skip = useCallback(
    () => setCursor((c) => Math.min(c + 1, lines.length)),
    [lines.length]
  );

  const nudge = (lineId: string, delta: number) =>
    setTimings((prev) => {
      if (prev[lineId] == null) return prev;
      return {
        ...prev,
        [lineId]: Math.max(0, Math.round((prev[lineId] + delta) * 10) / 10),
      };
    });

  const clearLine = (lineId: string) =>
    setTimings((prev) => {
      const next = { ...prev };
      delete next[lineId];
      return next;
    });

  const jumpTo = (lineId: string, index: number) => {
    setCursor(index);
    if (timings[lineId] != null) transport.seek(timings[lineId]);
  };

  // キーボード: Space=マーク, ←=戻る, →=スキップ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;
      if (e.code === "Space") {
        e.preventDefault();
        mark();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        back();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mark, back, skip]);

  const exportJson = JSON.stringify(
    lines
      .filter((l) => timings[l.id] != null)
      .map((l) => ({ lineId: l.id, start: timings[l.id] }))
      .sort((a, b) => a.start - b.start),
    null,
    2
  );

  const copyJson = () => navigator.clipboard?.writeText(exportJson);
  const markedCount = lines.filter((l) => timings[l.id] != null).length;

  return (
    <main className="capture-page">
      <header className="player-header">
        <Link href={`/play/${source.id}`} className="back-btn" aria-label="再生へ">
          ‹
        </Link>
        <div className="player-header-title">
          <span className="ph-title">タイムスタンプ作成</span>
          <span className="ph-sub">
            {source.title}（{markedCount}/{lines.length} 行）
          </span>
        </div>
      </header>

      {media && <div className="media-area">{media}</div>}

      <div className="capture-controls">
        <span className="capture-time">{fmt(transport.currentTime)}</span>
        <button className="cap-btn cap-sub" onClick={back}>
          ← 戻る
        </button>
        <button className="cap-btn cap-mark" onClick={mark}>
          マーク（Space）
        </button>
        <button className="cap-btn cap-sub" onClick={skip}>
          スキップ →
        </button>
      </div>

      <div className="capture-list">
        {lines.map((line, i) => {
          const t = timings[line.id];
          const isCursor = i === cursor;
          return (
            <div
              key={line.id}
              ref={isCursor ? cursorRef : null}
              className={`cap-row ${isCursor ? "cap-cursor" : ""} ${
                t != null ? "cap-done" : ""
              }`}
            >
              <button className="cap-line-text" onClick={() => jumpTo(line.id, i)}>
                <span className="cap-id">{line.id}</span>
                {line.text}
              </button>
              <div className="cap-time-edit">
                {t != null ? (
                  <>
                    <button onClick={() => nudge(line.id, -0.3)}>−</button>
                    <span className="cap-val">{t.toFixed(1)}s</span>
                    <button onClick={() => nudge(line.id, 0.3)}>＋</button>
                    <button className="cap-x" onClick={() => clearLine(line.id)}>
                      ×
                    </button>
                  </>
                ) : (
                  <span className="cap-val cap-empty">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <details className="capture-export">
        <summary>JSON出力（sources.ts の timings に貼り付け）</summary>
        <button className="cap-btn cap-copy" onClick={copyJson}>
          コピー
        </button>
        <textarea className="cap-json" readOnly value={exportJson} />
      </details>
    </main>
  );
}
