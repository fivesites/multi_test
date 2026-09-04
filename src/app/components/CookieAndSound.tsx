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

/** localStorage that can't throw — private mode, disabled storage, SSR. A
 *  failed write is surfaced rather than swallowed so a broken persist doesn't
 *  go unnoticed. */
const consentStore = {
  get(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
      if (window.localStorage.getItem(key) !== value) {
        console.warn(`[consent] "${key}" did not persist to localStorage`);
      }
    } catch (err) {
      console.warn(`[consent] could not write "${key}" to localStorage`, err);
    }
  },
};

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

    const cookie = consentStore.get("cookie-consent");
    const sound = consentStore.get("sound-consent");

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
    consentStore.set("cookie-consent", "accepted");
    setStep("sound");
  }

  function declineCookies() {
    consentStore.set("cookie-consent", "declined");
    settle(false);
  }

  // Either answer leaves the volume control in its place: "yes" unmutes and
  // offers Mute, "no" stays muted and offers Unmute.
  function answerSound(accepted: boolean) {
    consentStore.set("sound-consent", accepted ? "accepted" : "declined");
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
            "fixed z-50 bottom-0 right-3 lg:right-6 lg:left-auto w-2/3 lg:w-1/2  px-6 py-6 lg:px-6 flex flex-wrap h-auto    gap-3 items-baseline justify-start pixelCornersTop lg:items-baseline     ",

            step === "volume"
              ? "justify-between w-2/3 lg:w-1/2   "
              : "justify-end lg:justify-between  bg-accent w-2/3 lg:w-1/2     ",
            className,
          )}
        >
          {step === "cookie" ? (
            <>
              <p className={copy}>
                this site uses cookies to improve your experience.
              </p>
              <div className="flex flex-row-reverse  gap-3 justify-start w-min">
                <Button
                  variant="default"
                  size="sm"
                  className="  font-normal"
                  onClick={() => acceptCookies()}
                >
                  accept
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className=" border-none underline underline-offset-6 px-0 text-primary font-normal"
                  asChild
                >
                  <Link href="/privacy-policy" className="">
                    learn more
                  </Link>
                </Button>
              </div>
            </>
          ) : step === "sound" ? (
            <>
              <p className={copy}>Enable sound?</p>
              <div className="flex flex-row-reverse   gap-3">
                <Button size="sm" onClick={() => answerSound(true)}>
                  Yes
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className=" border-none underline underline-offset-6 px-0 text-primary font-normal"
                  onClick={() => answerSound(false)}
                >
                  No
                </Button>
              </div>
            </>
          ) : (
            /* Answered: nothing left to say, just the volume toggle. It takes
               the full width and spreads label-left / box-right so the row's
               justify-between has something to act on. */
            <div className="flex w-full items-center gap-3">
              <CheckButton
                className="w-full"
                labelSide="left"
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
