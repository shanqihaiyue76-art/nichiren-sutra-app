"use client";

import { TEXT_SIZES, textSizeLabel, useTextSize } from "@/lib/textSize";

/** 文字サイズ切替（小/中/大）。ルートのCSS変数へ即時反映・端末内保存。 */
export default function TextSizeControl() {
  const { size, setSize } = useTextSize();

  return (
    <div className="text-size-control" role="group" aria-label="文字サイズ">
      {TEXT_SIZES.map((s) => (
        <button
          key={s}
          type="button"
          className={`text-size-btn ${s === size ? "active" : ""}`}
          onClick={() => setSize(s)}
          aria-pressed={s === size}
        >
          {textSizeLabel(s)}
        </button>
      ))}
    </div>
  );
}
