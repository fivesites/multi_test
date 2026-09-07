"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Option = { id: string; label: string };

/**
 * The vertical sibling of {@link CheckToggle}: one row per option, the rows'
 * left cells joining into a single bordered column, and a filled block that
 * slides down it to the current option. `motion`'s shared-layout animation
 * (`layoutId`) carries the block between rows. Nothing here is rounded.
 */
export default function ThemeToggle({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly Option[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "inline-flex flex-col font-visual text-base lg:text-lg lowercase text-primary",
        className,
      )}
    >
      {options.map((option, i) => {
        const on = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={option.label}
            onClick={() => onChange(option.id)}
            className="flex items-stretch gap-x-3 h-[1.5em]  cursor-pointer"
          >
            {/* Left cell — the borders stack into one continuous column. */}
            <span
              className={cn(
                "relative flex w-[1.5em] shrink-0 border-x border-b border-current",
                i === 0 && "border-t",
              )}
            >
              {on && (
                <motion.span
                  layoutId="theme-toggle-fill"
                  transition={{ type: "spring", stiffness: 500, damping: 34 }}
                  className="absolute inset-[0.15em] bg-current"
                />
              )}
            </span>
            <span
              className={cn(
                "self-center lowercase text-sm",
                !on && "opacity-40 lowercase text-sm",
              )}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
