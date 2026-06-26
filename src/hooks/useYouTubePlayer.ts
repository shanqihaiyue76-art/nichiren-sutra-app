"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Transport } from "./transport";

let apiPromise: Promise<void> | null = null;

/** IFrame Player API スクリプトを一度だけ読み込む */
function loadIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

/**
 * YouTube IFrame Player を生成し、Transport として制御する。
 * elementId の <div> が iframe に置き換わる。
 */
export function useYouTubePlayer(
  elementId: string,
  youtubeId: string
): Transport {
  const playerRef = useRef<YT.Player | null>(null);
  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let disposed = false;
    loadIframeApi().then(() => {
      if (disposed || !window.YT) return;
      playerRef.current = new window.YT.Player(elementId, {
        videoId: youtubeId,
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e) => {
            if (disposed) return;
            setReady(true);
            setDuration(e.target.getDuration() || 0);
          },
          onStateChange: (e) => {
            if (disposed || !window.YT) return;
            setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
            const d = e.target.getDuration() || 0;
            if (d) setDuration(d);
          },
        },
      });
    });

    return () => {
      disposed = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* noop */
      }
      playerRef.current = null;
    };
  }, [elementId, youtubeId]);

  // 再生位置のポーリング（150ms ≒ 同期に十分・再描画を抑制）
  useEffect(() => {
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p || !p.getCurrentTime) return;
      setCurrentTime(p.getCurrentTime() || 0);
      const d = p.getDuration?.() || 0;
      if (d) setDuration(d);
    }, 150);
    return () => window.clearInterval(id);
  }, []);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p || !window.YT) return;
    if (p.getPlayerState() === window.YT.PlayerState.PLAYING) p.pauseVideo();
    else p.playVideo();
  }, []);

  const seek = useCallback((time: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(time, true);
    setCurrentTime(time);
  }, []);

  return { ready, isPlaying, currentTime, duration, togglePlay, seek };
}
