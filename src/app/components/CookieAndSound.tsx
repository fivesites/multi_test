"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Volume2 } from "@/components/animate-ui/icons/volume-2";
import { VolumeOff } from "@/components/animate-ui/icons/volume-off";
import { useReel } from "@/context/ReelContext";
import { cn } from "@/lib/utils";

/** How long the visitor gets to look at the page before we ask anything. */
const PROMPT_DELAY_MS = 6000;

/** Dev override: keep the box on screen no matter what — no delay, stored
 *  consent ignored, and answering loops back to the first question instead of
 *  dismissing it. Set to false to restore the real flow. */
const ALWAYS_SHOW = true;

type Step = "idle" | "cookie" | "sound" | "volume";

/**
 * The consent flow, rendered as a box that matches the hero's Connect box.
 * Cookies first, then sound; `onDone` fires once nothing is left to ask —
 * including for returning visitors, who are never prompted at all.
 */
export default function CookieAndSound({
  onDone,
  className,
}: {
  /** Must be stable (useCallback) — it is an effect dependency. */
  onDone?: (soundAccepted: boolean) => void;
  className?: string;
}) {
  const [step, setStep] = useState<Step>("idle");
  const { muted, toggleMute, setMuted } = useReel();

  const settle = useCallback(
    (soundAccepted: boolean) => {
      // "volume", not "idle": living in the layout makes this the only
      // site-wide sound control, so the toggle has to outlive the questions.
      setStep(ALWAYS_SHOW ? "cookie" : "volume");
      onDone?.(soundAccepted);
    },
    [onDone],
  );

  useEffect(() => {
    // Still report in, so whatever waits on consent (the Connect box, the
    // player) settles as usual while the box stays up.
    if (ALWAYS_SHOW) {
      setStep("cookie");
      onDone?.(false);
      return;
    }

    const cookie = localStorage.getItem("cookie-consent");
    const sound = localStorage.getItem("sound-consent");

    // Returning visitors have nothing left to answer, so settle immediately
    // rather than after the delay — the Connect box waits on this. Always
    // report `false`: unmuting on load needs a gesture, and without one the
    // browser rejects play() with NotAllowedError. They still get the volume
    // toggle, which is how they supply that gesture.
    if (cookie === "declined" || sound) {
      setStep("volume");
      onDone?.(false);
      return;
    }

    const t = setTimeout(
      () => setStep(cookie ? "sound" : "cookie"),
      PROMPT_DELAY_MS,
    );
    return () => clearTimeout(t);
  }, [onDone]);

  function acceptCookies() {
    localStorage.setItem("cookie-consent", "accepted");
    setStep("sound");
  }

  function declineCookies() {
    localStorage.setItem("cookie-consent", "declined");
    settle(false);
  }

  // Either answer leaves the volume control in its place: "yes" unmutes and
  // offers Mute, "no" stays muted and offers Unmute.
  function answerSound(accepted: boolean) {
    localStorage.setItem("sound-consent", accepted ? "accepted" : "declined");
    setMuted(!accepted);
    setStep("volume");
    onDone?.(accepted);
  }

  // Same surface, type and button metrics as the hero's Connect box. No
  // `w-full` on the copy — in this flex row it would stretch and push the
  // buttons to the far edge, which is what justify-start is trying to avoid.
  const copy =
    "  text-xs font-diatype text-primary    lg:max-w-lg lg:whitespace-nowrap";
  const action = " flex-1  ";

  return (
    <AnimatePresence mode="wait">
      {step !== "idle" && (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "fixed z-50 bottom-0 lg:top-13 lg:left-3 lg:right-3 lg:bottom-auto left-auto right-0  py-3 lg:py-1.5 flex    gap-3 items-center lg:items-baseline    ",

            step === "volume"
              ? "justify-start bg-transparent px-3  lg:px-0"
              : "justify-center lg:justify-start  bg-transparent lg:bg-transparent px-3    ",
            className,
          )}
        >
          {step === "cookie" ? (
            <>
              <p className={copy}>
                We use cookies to improve your{" "}
                <Button
                  variant="link"
                  size="xs"
                  className="underline underline-offset-4 px-0 text-primary"
                  asChild
                >
                  <Link href="/privacy-policy" className="">
                    experience
                  </Link>
                </Button>
                .
              </p>
              <div className="flex flex-row-reverse  gap-3 justify-start w-min">
                <Button size="xs" className={action} onClick={acceptCookies}>
                  Accept
                </Button>
                <Button
                  size="xs"
                  variant="secondary"
                  className={action}
                  onClick={declineCookies}
                >
                  Decline
                </Button>
              </div>
            </>
          ) : step === "sound" ? (
            <>
              <p className={copy}>Enable sound?</p>
              <div className="flex flex-row-reverse  gap-3">
                <Button
                  size="xs"
                  className={action}
                  onClick={() => answerSound(true)}
                >
                  Yes
                </Button>
                <Button
                  size="xs"
                  variant="secondary"
                  className={action}
                  onClick={() => answerSound(false)}
                >
                  No
                </Button>
              </div>
            </>
          ) : (
            /* Answered: nothing left to say, just the volume toggle. */
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="xs"
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={toggleMute}
                className="flex  justify-center items-center  "
              >
                {muted ? "Sound On" : "Sound Off"}
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
