"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Volume2 } from "@/components/animate-ui/icons/volume-2";
import { VolumeOff } from "@/components/animate-ui/icons/volume-off";
import { useSound } from "@/context/SoundContext";
import { cn } from "@/lib/utils";
import CheckButton from "./CheckButton";

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
  const { muted, toggleMute, setMuted, markConsentSettled } = useSound();
  // The projects page (settings sheet) and the homepage (hero corner) carry
  // their own sound toggle, so the standing corner toggle stands down there.
  const pathname = usePathname();
  const hasOwnSoundToggle =
    (pathname?.startsWith("/projects") ?? false) || pathname === "/";

  const settle = useCallback(
    (soundAccepted: boolean) => {
      // "volume", not "idle": living in the layout makes this the only
      // site-wide sound control, so the toggle has to outlive the questions.
      setStep(ALWAYS_SHOW ? "cookie" : "volume");
      markConsentSettled();
      onDone?.(soundAccepted);
    },
    [onDone, markConsentSettled],
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
      markConsentSettled();
      onDone?.(false);
      return;
    }

    const t = setTimeout(
      () => setStep(cookie ? "sound" : "cookie"),
      PROMPT_DELAY_MS,
    );
    return () => clearTimeout(t);
  }, [onDone, markConsentSettled]);

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
    markConsentSettled();
    onDone?.(accepted);
  }

  // Same surface, type and button metrics as the hero's Connect box. No
  // `w-full` on the copy — in this flex row it would stretch and push the
  // buttons to the far edge, which is what justify-start is trying to avoid.
  const copy =
    "  text-sm font-visual lowercase tracking-wide text-primary    lg:max-w-lg lg:whitespace-nowrap";
  const action = " flex-1 h-6 font-normal   ";

  return (
    <AnimatePresence mode="wait">
      {step !== "idle" && !(step === "volume" && hasOwnSoundToggle) && (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "fixed z-50 bottom-0 lg:right-0 left-auto right-0  px-6 pb-6 lg:px-6 flex h-auto  lg:h-12  gap-3 items-center lg:items-baseline    ",

            step === "volume"
              ? "justify-end bg-transparent "
              : "justify-center lg:justify-end  bg-transparent lg:bg-transparent    ",
            // Desktop has MultiVertNav's Sound On checkbox, so the sound
            // question and the volume toggle are mobile-only there.
            step !== "cookie" && "lg:hidden",
            className,
          )}
        >
          {step === "cookie" ? (
            <>
              <p className={copy}>
                We use cookies to improve your{" "}
                <Button
                  variant="link"
                  size="sm"
                  className=" border-none underline underline-offset-6 px-0 text-primary font-normal"
                  asChild
                >
                  <Link href="/privacy-policy" className="">
                    experience
                  </Link>
                </Button>
                .
              </p>
              <div className="flex flex-row-reverse  gap-3 justify-start w-min">
                <Button size="sm" className={action} onClick={acceptCookies}>
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
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
              <div className="flex flex-row-reverse   gap-3">
                <Button
                  size="sm"
                  className={action}
                  onClick={() => answerSound(true)}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
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
              <CheckButton
                className="lg:hidden "
                size="label"
                label={muted ? "sound off" : "sound on"}
                active={!muted}
                onClick={toggleMute}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
