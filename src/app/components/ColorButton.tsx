"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** A single palette control: the mark is a box split down the middle — one half
 *  `bg-primary`, the other `bg-primary-foreground`. Every click cycles the
 *  palette and, in step with it, turns the mark a quarter and morphs it between
 *  a disc and a rectangle (`rounded-full` ⇆ `rounded-none`). `shape` picks the
 *  resting form; `labelSide` shows the palette name beside it, omit it for a
 *  mark-only button. */
export default function ColorButton({
  label,
  active,
  onClick,
  className = "",
  labelSide,
  shape = "square",
}: {
  label?: string;
  active: boolean;
  onClick: () => void;
  className?: string;
  labelSide?: "left" | "right";
  shape?: "square" | "circle";
}) {
  // Counted up rather than wrapped at 4, so the mark keeps turning the same
  // way instead of snapping back to zero on every fourth click.
  const [turns, setTurns] = useState(0);

  // The mark alternates disc/rectangle on each click; `shape` sets which one it
  // starts on, so a "circle" button is round on the even turns.
  const round = turns % 2 === (shape === "circle" ? 0 : 1);

  const labelEl = labelSide ? (
    <span className="shrink-0 cursor-pointer font-visual text-lg font-normal tracking-wide lowercase text-primary">
      {label}
    </span>
  ) : null;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={label}
      onClick={() => {
        setTurns((t) => t + 1);
        onClick();
      }}
      className={cn(
        "flex cursor-pointer items-center bg-transparent gap-x-3 w-full px-6 lg:px-3 h-12 lg:h-12",
        className,
      )}
    >
      {labelSide === "left" && labelEl}
      {/* Rotation and the disc/rectangle morph run on the same element and the
          same 0.25s ease, so the mark turns as it rounds. `overflow-hidden`
          keeps the two colour halves clipped to the animated radius; 9999 reads
          as px, fully round at this size. */}
      <motion.span
        className="flex h-2 w-2 lg:h-4 lg:w-4 shrink-0 overflow-hidden border border-current"
        initial={false}
        animate={{ rotate: turns * 90, borderRadius: round ? 9999 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <span className="h-full w-1/2 bg-primary" />
        <span className="h-full w-1/2 bg-transparent" />
      </motion.span>
      {labelSide === "right" && labelEl}
    </button>
  );
}
