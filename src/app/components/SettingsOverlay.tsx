"use client";

import { motion } from "motion/react";
import { useSound } from "@/context/SoundContext";
import { cn } from "@/lib/utils";
import CheckButton from "./CheckButton";
import { ViewToggleButtons } from "./ViewToggles";

/** The projects settings panel: the sound toggle and the view toggles
 *  (thumbnails / list / zoom). Positioning is the caller's — M2Nav hangs it off
 *  the desktop "settings" button, FilterOverlay drops it into the mobile
 *  full-screen sheet. */
export default function SettingsOverlay({ className }: { className?: string }) {
  const { muted, toggleMute } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn("flex flex-col gap-4", className)}
    >
      {!muted && (
        <div className="lg:hidden grid grid-cols-2 flex-col gap-x-4 border bg-secondary pr-4">
          <CheckButton
            className="font-visual font-thin lowercase text-xl whitespace-nowrap"
            size="lg"
            label={muted ? "Sound Off" : "Sound On"}
            active={!muted}
            onClick={toggleMute}
          />
        </div>
      )}
      <ViewToggleButtons className="" />
    </motion.div>
  );
}
