"use client";

import { useMemo } from "react";
import type { PlaybackSource } from "@/data/types";
import { buildTrack } from "@/lib/track";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import CaptureBody from "./CaptureBody";

/** 音源種別に応じてプレイヤーを選び、作成ツール本体へ渡す入口 */
export default function CaptureClient({ source }: { source: PlaybackSource }) {
  const track = useMemo(() => buildTrack(source), [source]);

  if (source.kind === "youtube" && source.youtubeId) {
    return <YouTubeCapture source={source} track={track} />;
  }
  return <AudioCapture source={source} track={track} />;
}

function YouTubeCapture({
  source,
  track,
}: {
  source: PlaybackSource;
  track: ReturnType<typeof buildTrack>;
}) {
  const elementId = `yt-capture-${source.id}`;
  const transport = useYouTubePlayer(elementId, source.youtubeId as string);
  const media = (
    <div className="yt-frame">
      <div id={elementId} className="yt-iframe" />
    </div>
  );
  return <CaptureBody track={track} transport={transport} media={media} />;
}

function AudioCapture({
  source,
  track,
}: {
  source: PlaybackSource;
  track: ReturnType<typeof buildTrack>;
}) {
  const { audioRef, ...transport } = useAudioPlayer();
  const media = (
    <audio ref={audioRef} src={source.audioUrl} preload="metadata" controls />
  );
  return <CaptureBody track={track} transport={transport} media={media} />;
}
