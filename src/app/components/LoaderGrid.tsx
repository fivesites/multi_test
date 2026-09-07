"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** The loader stays up at least this long after a navigation. */
const MIN_VISIBLE_MS = 3000;

/** How often the grid flips between the two frames while it's up. */
const FLIP_MS = 500;

// Kept in step with the responsive `grid-cols-* grid-rows-*` classes below so
// the cell count always exactly fills the grid — no clipped or empty tracks.
const GRID = {
  base: { cols: 3, rows: 5 },
  lg: { cols: 12, rows: 5 },
} as const;
const LG_QUERY = "(min-width: 1024px)";

// The two concentric-square frames as mask shapes — same geometry as the
// Loading4 / Loading5 marks: a 6px frame plus one diagonal pair of inner
// squares. Drawn in black on transparent so they read as an alpha mask; the
// cell's `bg-primary` is what actually colours them, so they track the theme.
const frame = (inner: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>${inner}</svg>`,
  )}")`;
const BORDER =
  "<path d='M42 0H48V48H42V0Z M0 0H6V48H0V0Z M48 0V6H0V0H48Z M48 42V48H0V42H48Z'/>";
const MARK_A = frame(
  `${BORDER}<rect x='6' y='6' width='18' height='18'/><rect x='24' y='24' width='18' height='18'/>`,
);
const MARK_B = frame(
  `${BORDER}<rect x='24' y='6' width='18' height='18'/><rect x='6' y='24' width='18' height='18'/>`,
);

/**
 * A grid of concentric-square marks that covers the page on every route change
 * for at least {@link MIN_VISIBLE_MS} — {@link GRID}.base cells below `lg`,
 * {@link GRID}.lg above. Each cell flips between the two frames on a
 * checkerboard that inverts every {@link FLIP_MS}, so the whole field ripples
 * while the next page loads behind it. The marks are `bg-primary` under an SVG
 * mask, so they follow the active theme like the CheckButton checkboxes do.
 */
export default function LoaderGrid() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0);
  const [isLg, setIsLg] = useState(false);

  // Match the JS cell count to the breakpoint the CSS grid is using.
  useEffect(() => {
    const mq = window.matchMedia(LG_QUERY);
    const sync = () => setIsLg(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const { cols, rows } = isLg ? GRID.lg : GRID.base;

  // Show on first mount and on every route change; hold for MIN_VISIBLE_MS.
  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), MIN_VISIBLE_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  // Invert the checkerboard on a loop while the loader is up.
  useEffect(() => {
    if (!visible || reduce) return;
    const id = setInterval(() => setPhase((p) => p + 1), FLIP_MS);
    return () => clearInterval(id);
  }, [visible, reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader-grid"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] grid grid-cols-3 lg:grid-cols-12 p-6 grid-rows-5 lg:grid-rows-5 overflow-hidden bg-background"
          aria-hidden
        >
          {Array.from({ length: cols * rows }, (_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const mark = (phase + row + col) % 2 === 0 ? MARK_A : MARK_B;
            return (
              // The cell fills its grid track; the mark inside matches the
              // CheckButton checkbox glyph — ~0.7em of text-base / lg:text-lg.
              <span
                key={i}
                className="flex items-start justify-start text-base lg:text-lg"
              >
                <span
                  className="block h-[0.7em] w-[0.7em] bg-primary [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_100%] [mask-repeat:no-repeat] [mask-size:100%_100%]"
                  style={{ maskImage: mark, WebkitMaskImage: mark }}
                />
              </span>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
