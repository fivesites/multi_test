"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A pill-style two-position toggle drawn in the CheckButton language — a square
 * bordered track with a filled block that slides end to end. `motion`'s layout
 * animation carries the block across when `active` flips; nothing here is
 * rounded.
 *
 * `offLabel` / `onLabel` sit either side of the track; the side that isn't
 * current is dimmed. Pass `label` to override the composed `aria-label`.
 */
export default function CheckToggle({
  className,
  offLabel,
  onLabel,
  label,
  active = false,
  onClick,
}: {
  className?: string;
  offLabel?: string;
  onLabel?: string;
  label?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const ariaLabel =
    label ?? ([offLabel, onLabel].filter(Boolean).join(" / ") || undefined);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-x-3 h-12 cursor-pointer font-visual text-base lg:text-lg lowercase text-primary",
        className,
      )}
    >
      {offLabel && (
        <span aria-hidden className={cn(active && "opacity-40")}>
          {offLabel}
        </span>
      )}
      <span
        className={cn(
          // border + fill ride on currentColor so the toggle inverts wherever
          // the text colour does — the same trick the cursor marks use.
          "flex h-[0.7em] w-[1.4em] shrink-0 items-center border border-current p-[0.15em]",
          active ? "justify-end" : "justify-start",
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 34 }}
          className="block h-full aspect-square bg-current"
        />
      </span>
      {onLabel && (
        <span aria-hidden className={cn(!active && "opacity-40")}>
          {onLabel}
        </span>
      )}
    </button>
  );
}
