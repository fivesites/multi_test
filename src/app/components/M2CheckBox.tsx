"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

// Seconds per cell, matching TypedWord's convention: filling is a shade slower
// than emptying, so ticking the box reads as deliberate and clearing it does
// not linger. Nine cells, so the fill runs ~0.7s end to end.
export const FILL_INTERVAL = 0.06;
export const CLEAR_INTERVAL = 0.035;

/** The fill is a grid of cells rather than one block, so it can arrive a piece
 *  at a time. The column count is a literal class because Tailwind only emits
 *  classes it can find written out in full — keep CELLS in step with it. */
const GRID_COLS = "grid-cols-3";
const CELLS = 9;

/** Footprint only — the border is a hairline at every size, declared once on
 *  the box itself rather than repeated per entry. */
const SIZE_BOX = {
  sm: "w-3 h-3 lg:w-4 lg:h-4",
  md: "w-3 h-3 lg:w-4 lg:h-4",
  lg: "w-4 h-4",
} as const;

// No scale or movement: at 12-16px a cell is a few pixels across, and anything
// but a straight fade turns the stagger into mush.
//
// The transition lives INSIDE each variant, never as a `transition` prop on the
// child. The parent staggers by injecting a delay into the transition it hands
// down, and a prop on the child replaces that object wholesale — delay and all,
// so every cell would fire at once and the stagger would vanish.
const cellVariants: Variants = {
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  hidden: { opacity: 0, transition: { duration: 0.14, ease: "easeIn" } },
};

/** The checkbox mark: a bordered square whose fill lands one cell at a time,
 *  and empties in reverse. Controlled — it renders `active`, it does not own
 *  it, so the button around it stays the single source of truth. Decorative by
 *  design: the control that wraps it carries the role and aria-checked. */
export default function M2CheckBox({
  active = false,
  size = "md",
  className,
}: {
  active?: boolean;
  size?: keyof typeof SIZE_BOX;
  className?: string;
}) {
  return (
    <motion.span
      aria-hidden
      // The box only animates when it is toggled, never on mount — a page of
      // nav rows should not tick themselves on as it loads.
      initial={false}
      animate={active ? "visible" : "hidden"}
      variants={{
        visible: { transition: { staggerChildren: FILL_INTERVAL } },
        hidden: {
          transition: {
            staggerChildren: CLEAR_INTERVAL,
            // Empty from the last cell back, so the fill retraces its path.
            staggerDirection: -1,
          },
        },
      }}
      className={cn(
        // overflow-hidden is load-bearing, not tidiness: a grid container
        // exports the baseline of its first row, so without it the box hangs a
        // third of the way down the text baseline. Clipping makes it synthesise
        // a baseline from its own bottom border edge, so it sits on the line
        // like the plain square it replaced.
        "grid aspect-square shrink-0 overflow-hidden border-1 border-primary",
        GRID_COLS,
        SIZE_BOX[size],
        className,
      )}
    >
      {Array.from({ length: CELLS }, (_, i) => (
        <motion.span
          key={i}
          variants={cellVariants}
          // Inverts with the container so the hover preview reads on a
          // ticked box as well as an empty one.
          className="bg-primary transition-colors group-hover:bg-secondary"
        />
      ))}
    </motion.span>
  );
}
