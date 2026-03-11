"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const TYPING_SPEED = 55;
const DELETING_SPEED = 30;
const HOLD_DELAY = 1800;
const START_DELAY = 400;

export default function HeroText({
  texts,
  displayedText,
  triggerOnView = false,
  scrollDriven = false,
  truncateAt,
  unlocked,
  onTruncateReached,
  className,
}: {
  texts: string[];
  /** When provided, bypasses the internal state machine and renders this string directly. */
  displayedText?: string;
  triggerOnView?: boolean;
  scrollDriven?: boolean;
  truncateAt?: number;
  unlocked?: boolean;
  onTruncateReached?: () => void;
  className?: string;
}) {
  const [textIndex, setTextIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">(
    "typing",
  );
  const [inView, setInView] = useState(!triggerOnView);
  const [timeTyping, setTimeTyping] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const truncateReachedRef = useRef(false);

  // When unlocked, switch from scroll-driven to time-based typing
  useEffect(() => {
    if (unlocked && scrollDriven) {
      setTimeTyping(true);
    }
  }, [unlocked, scrollDriven]);

  // Scroll-driven mode: map scroll position to character count
  useEffect(() => {
    if (!scrollDriven || timeTyping) return;
    const el = ref.current;
    if (!el) return;
    const text = texts[0];
    const cap =
      truncateAt !== undefined && !unlocked ? truncateAt : text.length;

    const update = () => {
      const docTop = el.getBoundingClientRect().top + window.scrollY;
      const vh = window.innerHeight;
      const scrollStart = docTop - vh * 0.6;
      const scrollEnd = docTop + vh * 0.9;
      const progress = Math.max(
        0,
        Math.min(1, (window.scrollY - scrollStart) / (scrollEnd - scrollStart)),
      );
      const chars = Math.min(Math.floor(progress * text.length), cap);
      setDisplayed(text.slice(0, chars));

      if (
        !truncateReachedRef.current &&
        chars >= cap &&
        truncateAt !== undefined &&
        !unlocked
      ) {
        truncateReachedRef.current = true;
        onTruncateReached?.();
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [
    scrollDriven,
    texts,
    timeTyping,
    truncateAt,
    unlocked,
    onTruncateReached,
  ]);

  // triggerOnView: delay typing until element is in viewport
  useEffect(() => {
    if (!triggerOnView || scrollDriven) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerOnView, scrollDriven]);

  // Time-based typing state machine (also handles scroll-driven continuation after unlock)
  useEffect(() => {
    if (scrollDriven && !timeTyping) return;
    if (!scrollDriven && !inView) return;
    const target = texts[textIndex];

    if (phase === "typing") {
      if (displayed.length < target.length) {
        const t = setTimeout(
          () => setDisplayed(target.slice(0, displayed.length + 1)),
          displayed.length === 0 ? START_DELAY : TYPING_SPEED,
        );
        return () => clearTimeout(t);
      } else if (!scrollDriven && texts.length > 1) {
        const t = setTimeout(() => setPhase("holding"), HOLD_DELAY);
        return () => clearTimeout(t);
      }
    }

    if (!scrollDriven) {
      if (phase === "holding") {
        setPhase("deleting");
      }

      if (phase === "deleting") {
        if (displayed.length > 0) {
          const t = setTimeout(
            () => setDisplayed(displayed.slice(0, -1)),
            DELETING_SPEED,
          );
          return () => clearTimeout(t);
        } else {
          setTextIndex((i) => (i + 1) % texts.length);
          setPhase("typing");
        }
      }
    }
  }, [displayed, phase, textIndex, texts, inView, scrollDriven, timeTyping]);

  const effectiveText = displayedText ?? displayed;
  const hideCursor =
    displayedText !== undefined && displayedText.length >= texts[0]?.length;

  return (
    <span
      ref={ref}
      className={`inline-flex items-baseline  font-absolution1 justify-start  ${className ?? ""}`}
    >
      {effectiveText}
      {!hideCursor && (
        <motion.span
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          className="ml-[2px] inline-block w-[2px] h-[1em] bg-current align-middle"
        />
      )}
    </span>
  );
}
