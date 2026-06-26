"use client";

interface Props {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
}

function fmt(sec: number): string {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlayerControls({
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
}: Props) {
  return (
    <div className="player">
      <input
        className="seek"
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={Math.min(currentTime, duration || 0)}
        onChange={(e) => onSeek(Number(e.target.value))}
        aria-label="シークバー"
      />
      <div className="player-row">
        <span className="time">{fmt(currentTime)}</span>
        <button
          className="play-btn"
          onClick={onTogglePlay}
          aria-label={isPlaying ? "停止" : "再生"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <span className="time">{fmt(duration)}</span>
      </div>
    </div>
  );
}
