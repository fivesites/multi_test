"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useReel } from "@/context/ReelContext";
import { useSound } from "@/context/SoundContext";
import CookieAndSound from "./CookieAndSound";
import MultiPlayer from "./MultiPlayer";

const TRACK_LABEL = "Multi² — Showreel";

export default function BottomNav() {
  const { overReel, playedThrough } = useReel();
  const { setMuted } = useSound();

  // desktop only: motion animates a value, so the breakpoint can't be a class
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const hidePlayer = isDesktop && playedThrough;

  // false until the consent flow is settled
  const [showPlayer, setShowPlayer] = useState(false);

  // Accepting sound is a click, so unmuting there is allowed. Unmuting on load
  // is not: browsers block unmuted playback without a gesture, which throws
  // NotAllowedError. Returning visitors therefore stay muted until they use
  // the transport's volume button.
  const settleConsent = useCallback(
    (soundAccepted: boolean) => {
      setShowPlayer(true);
      if (soundAccepted) setMuted(false);
    },
    [setMuted],
  );

  // returning visitors skip the prompts, so just reveal the transport
  useEffect(() => {
    if (
      localStorage.getItem("sound-consent") ||
      localStorage.getItem("cookie-consent") === "declined"
    ) {
      setShowPlayer(true);
    }
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 z-50 w-full  h-[60px] items-center transition-colors duration-300 hidden",
        // blend over the reel while it's on screen; solid once the projects are
        overReel
          ? "bg-transparent mix-blend-difference text-background"
          : "bg-neutral-200 mix-blend-normal text-neutral-600 shadow-xl",
      )}
    >
      <CookieAndSound onDone={settleConsent} />

      <AnimatePresence>
        {showPlayer && (
          <motion.div
            key="player"
            initial={{ opacity: 0, y: 4 }}
            // slides down out of the bar once the reel has played through
            animate={{ opacity: hidePlayer ? 0 : 1, y: hidePlayer ? 60 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: hidePlayer ? 0.45 : 0.25, ease: "easeOut" }}
            className="flex-1 min-w-0"
          >
            <MultiPlayer label={TRACK_LABEL} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Settings — pinned bottom right */}
    </div>
  );
}
