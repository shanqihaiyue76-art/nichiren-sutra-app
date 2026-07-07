"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * 文字サイズ設定（3段階・端末内保存・即時反映）。
 *
 * ルート要素のfont-sizeをCSS変数 --text-scale で拡大縮小することで、
 * rem単位を使う全UIへ一括反映する（globals.css参照）。
 */
const KEY = "dokyo.textSize";

export type TextSize = "sm" | "md" | "lg";

const SCALE: Record<TextSize, number> = { sm: 0.875, md: 1, lg: 1.15 };
const LABEL: Record<TextSize, string> = { sm: "小", md: "中", lg: "大" };

export const TEXT_SIZES: TextSize[] = ["sm", "md", "lg"];

export function textSizeLabel(size: TextSize): string {
  return LABEL[size];
}

function isTextSize(v: unknown): v is TextSize {
  return v === "sm" || v === "md" || v === "lg";
}

function apply(size: TextSize): void {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--text-scale", String(SCALE[size]));
}

function read(): TextSize {
  if (typeof window === "undefined") return "md";
  try {
    const raw = window.localStorage.getItem(KEY);
    return isTextSize(raw) ? raw : "md";
  } catch {
    return "md";
  }
}

function write(size: TextSize): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, size);
  } catch {
    /* 容量超過・プライベートモード等は黙って無視 */
  }
}

/** 文字サイズの読み書きフック。マウント時に復元し、変更を即座にCSS変数へ反映する。 */
export function useTextSize() {
  const [size, setSizeState] = useState<TextSize>("md");

  useEffect(() => {
    const s = read();
    setSizeState(s);
    apply(s);
  }, []);

  const setSize = useCallback((s: TextSize) => {
    setSizeState(s);
    apply(s);
    write(s);
  }, []);

  return { size, setSize };
}
