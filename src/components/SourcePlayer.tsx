"use client";

import { useMemo } from "react";
import type { PlaybackSource } from "@/data/types";
import { buildTrack } from "@/lib/track";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import PlayerBody from "./PlayerBody";

/** 音源の種類に応じてプレイヤーを選び、再生本体に渡す入口 */
export default function SourcePlayer({ source }: { source: PlaybackSource }) {
  const track = useMemo(() => buildTrack(source), [source]);

  if (source.kind === "youtube" && source.youtubeId) {
    return <YouTubeStage source={source} track={track} />;
  }
  return <AudioStage source={source} track={track} />;
}

function YouTubeStage({
  source,
  track,
}: {
  source: PlaybackSource;
  track: ReturnType<typeof buildTrack>;
}) {
  const elementId = `yt-player-${source.id}`;
  const transport = useYouTubePlayer(elementId, source.youtubeId as string);
  const media = (
    <div className="yt-frame">
      <div id={elementId} className="yt-iframe" />
    </div>
  );
  return <PlayerBody track={track} transport={transport} media={media} />;
}

function AudioStage({
  source,
  track,
}: {
  source: PlaybackSource;
  track: ReturnType<typeof buildTrack>;
}) {
  const { audioRef, ...transport } = useAudioPlayer();
  const media = <audio ref={audioRef} src={source.audioUrl} preload="metadata" />;
  return <PlayerBody track={track} transport={transport} media={media} />;
}
