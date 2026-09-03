"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Shared easing — a soft settle, no overshoot. Matches the site's "subtle and
 *  purposeful" motion brief. */
const EASE = [0.22, 1, 0.36, 1] as const;

/** The viewport trigger: fire once, a little before the block is fully on
 *  screen so it's already settled by the time the reader reaches it. */
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Travel distance in px. */
  y?: number;
  /** Seconds to wait before starting — for staggering siblings. */
  delay?: number;
  duration?: number;
};

/**
 * Fades and lifts its children into place the first time they scroll into view.
 * Wraps them in a plain `div` (so it can be a grid/flex item like any other),
 * and steps aside entirely when the visitor prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  y = 24,
  delay = 0,
  duration = 0.6,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

type RevealImageProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * For media: clips its children and eases them back from a slight zoom as they
 * enter view, so images settle rather than snap. The child should fill this
 * box (an `absolute inset-0` layer or a sized element).
 */
export function RevealImage({ children, className, delay = 0 }: RevealImageProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={cn("overflow-hidden", className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ opacity: 0, scale: 1.09 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
