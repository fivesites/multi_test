"use client";

import { useEffect, useState } from "react";
import TypedWord, { TYPING_INTERVAL, ERASING_INTERVAL } from "./TypedWord";
import { cn } from "@/lib/utils";

/**
 * Cycles TypedWord through a list of words: types one in, holds it, erases it,
 * then moves on to the next.
 *
 * TypedWord already animates both directions off its `visible` prop, so this
 * only owns the timing. The `key` remount matters — swapping `text` on a live
 * TypedWord would let the new letters inherit the parent's already-visible
 * state and pop in all at once instead of staggering.
 */
export default function TypedRotator({
  words,
  holdMs = 2200,
  gapMs = 400,
  speed = 1,
  className,
  cursor = false,
  cursorClassName,
}: {
  words: string[];
  /** How long a finished word stays on screen before it erases. */
  holdMs?: number;
  /** Pause on the empty line between one word and the next. */
  gapMs?: number;
  speed?: number;
  className?: string;
  cursor?: boolean | string;
  cursorClassName?: string;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const word = words[index] ?? "";

  useEffect(() => {
    // Nothing to rotate to — leave the single word typed in.
    if (words.length < 2) return;

    if (visible) {
      const typeMs = word.length * TYPING_INTERVAL * speed * 1000;
      const t = setTimeout(() => setVisible(false), typeMs + holdMs);
      return () => clearTimeout(t);
    }

    const eraseMs = word.length * ERASING_INTERVAL * speed * 1000;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % words.length);
      setVisible(true);
    }, eraseMs + gapMs);
    return () => clearTimeout(t);
  }, [visible, word, words.length, holdMs, gapMs, speed]);

  return (
    <span className={cn("inline-grid", className)}>
      {/* Typing adds and removes letters from the layout, so the box would
          otherwise collapse mid-erase and reflow whatever sits next to it.
          Every word is laid out invisibly in the same grid cell to hold the
          track open at the largest of them; the typed word overlays it. */}
      {words.map((w) => (
        <span key={w} aria-hidden className="col-start-1 row-start-1 invisible">
          {w}
        </span>
      ))}
      <TypedWord
        key={index}
        text={word}
        visible={visible}
        speed={speed}
        cursor={cursor}
        cursorClassName={cursorClassName}
        className="col-start-1 row-start-1"
      />
    </span>
  );
}
