"use client";

import type { TimedLine } from "@/lib/track";

interface Props {
  line: TimedLine | null;
  onClose: () => void;
}

export default function TranslationSheet({ line, onClose }: Props) {
  const open = line !== null;
  return (
    <>
      <div
        className={`sheet-overlay ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <div
        className={`sheet ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="sheet-handle" />
        {line && (
          <div className="sheet-body">
            <p className="sheet-text">{line.text}</p>
            {line.reading && <p className="sheet-reading">{line.reading}</p>}
            <hr className="sheet-divider" />
            <p className="sheet-label">現代語訳</p>
            <p className="sheet-translation">{line.translation}</p>
            {line.commentary && (
              <>
                <p className="sheet-label">解説</p>
                <p className="sheet-translation">{line.commentary}</p>
              </>
            )}
          </div>
        )}
        <button className="sheet-close" onClick={onClose}>
          閉じる
        </button>
      </div>
    </>
  );
}
