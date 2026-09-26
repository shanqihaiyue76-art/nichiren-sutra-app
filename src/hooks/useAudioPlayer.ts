"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Transport } from "./transport";

/**
 * HTML <audio> を Transport として制御する。
 * 返り値の audioRef を <audio> 要素に渡すこと。
 */
export function useAudioPlayer(): Transport & {
  audioRef: React.RefObject<HTMLAudioElement | null>;
} {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => setCurrentTime(el.currentTime);
    const onLoaded = () => setDuration(el.duration || 0);
    const onPlay = () => {
      setIsPlaying(true);
      setEnded(false);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setEnded(true);
    };

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("durationchange", onLoaded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);

    // メタデータを既に取得済みの場合（イベント取りこぼし対策）
    if (el.readyState >= 1) {
      setDuration(el.duration || 0);
      setCurrentTime(el.currentTime);
    }

    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("durationchange", onLoaded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  // 再生中は100msごとに位置を読む。timeupdate（約250ms間隔）だけだと、
  // 行ハイライトの切替や1行くり返しの折り返しが遅れるため。
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      const el = audioRef.current;
      if (el) setCurrentTime(el.currentTime);
    }, 100);
    return () => window.clearInterval(id);
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  }, []);

  const seek = useCallback((time: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = time;
    setCurrentTime(time);
    setEnded(false);
  }, []);

  return { audioRef, ready: true, isPlaying, ended, currentTime, duration, togglePlay, seek };
}
