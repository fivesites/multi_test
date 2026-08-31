"use client";

import { cn } from "@/lib/utils";
import { Play } from "@/components/animate-ui/icons/play";
import { Pause } from "@/components/animate-ui/icons/pause";
import { Volume2 } from "@/components/animate-ui/icons/volume-2";
import { VolumeOff } from "@/components/animate-ui/icons/volume-off";
import { useReel } from "@/context/ReelContext";
import { useSound } from "@/context/SoundContext";

const ICON_SIZE = 18;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Transport for the showreel. The ReactPlayer instance itself lives in
 * ShowReel; this drives it through ReelContext.
 */
export default function MultiPlayer({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const { playing, currentTime, duration, toggle, ready } = useReel();
  const { muted, toggleMute } = useSound();
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={cn(
        "flex items-center gap-x-3 w-full uppercase buttonTextSM  ",
        className,
      )}
    >
      <button
        onClick={toggle}
        disabled={!ready}
        aria-label={playing ? "Pause" : "Play"}
        className="  cursor-pointer shrink-0 h-[60px] aspect-square w-[60px] flex items-center justify-center bg-transparent hover:bg-foreground/10 disabled:opacity-40"
      >
        {playing ? (
          <Pause size={ICON_SIZE} animateOnHover />
        ) : (
          <Play size={ICON_SIZE} animateOnHover />
        )}
      </button>

      {/* flex-1 has to live here: inside the column below it would grow
          vertically instead of stretching the bar across the row */}
      <div className="flex flex-1 min-w-0 flex-col items-start gap-y-2">
        {label && <span className="truncate shrink-0">{label}</span>}

        {/* Progress — desktop only, just a line filling up */}
        <div
          className="hidden  w-full h-1 rounded-full bg-current/20"
          role="progressbar"
          aria-label="Progress"
          aria-valuenow={Math.round(progress)}
        >
          <div
            className="h-full bg-current"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <span className="inline shrink-0 tabular-nums">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      <button
        onClick={toggleMute}
        disabled={!ready}
        aria-label={muted ? "Unmute" : "Mute"}
        className="cursor-pointer shrink-0 w-[60px] h-[60px] aspect-square flex items-center justify-center  disabled:opacity-40"
      >
        {muted ? (
          <VolumeOff size={ICON_SIZE} animateOnHover />
        ) : (
          <Volume2 size={ICON_SIZE} animateOnHover />
        )}
      </button>
    </div>
  );
}
