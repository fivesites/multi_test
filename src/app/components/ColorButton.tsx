"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Loading5 } from "./marks";

/** A single palette control: the mark draws in `swatch`'s colour and takes a
 *  quarter turn on every click. `labelSide` shows the palette name beside it;
 *  omit it for a swatch-only button. */
export default function ColorButton({
  label,
  active,
  swatch,
  onClick,
  className = "",
  labelSide,
}: {
  label: string;
  active: boolean;
  swatch: string;
  onClick: () => void;
  className?: string;
  labelSide?: "left" | "right";
}) {
  // Counted up rather than wrapped at 4, so the mark keeps turning the same
  // way instead of snapping back to zero on every fourth click.
  const [turns, setTurns] = useState(0);

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
        "flex cursor-pointer items-center bg-transparent gap-x-3 w-full px-6 lg:px-3 h-16 lg:h-12",
        className,
      )}
    >
      {labelSide === "left" && labelEl}
      {/* The mark draws in currentColor, so the palette's colour rides in as a
          text colour. The quarter turn sits on a wrapper: the svg is inline,
          so it needs a block box of its own to rotate about its own centre. */}
      <motion.span
        className="flex shrink-0"
        animate={{ rotate: turns * 90 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Loading5 className={`h-3 w-3 ${swatch}`} />
      </motion.span>
      {labelSide === "right" && labelEl}
    </button>
  );
}
