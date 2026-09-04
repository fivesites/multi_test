"use client";

import ReactPlayer from "react-player";
import { cn } from "@/lib/utils";
import { useSound } from "@/context/SoundContext";

/** Plays a project's video media — a direct upload or a YouTube/Vimeo URL;
 *  ReactPlayer tells the two apart from the URL itself. Volume follows the
 *  site-wide sound toggle so it behaves like every other video on the site
 *  (ShowReel included) rather than being hard-muted.
 *
 *  `controls` switches this from a silent looping backdrop (hero, gallery)
 *  to a deliberate watch with the player's own transport (the lightbox) —
 *  its native volume control still lets a visitor unmute just this video
 *  without touching the site-wide toggle. */
export default function VideoPlayer({
  src,
  className,
  controls = false,
}: {
  src: string;
  className?: string;
  controls?: boolean;
}) {
  const { muted, volume } = useSound();

  return (
    <ReactPlayer
      src={src}
      autoPlay
      loop={!controls}
      controls={controls}
      muted={muted}
      volume={volume}
      playsInline
      className={cn("object-cover", className)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
