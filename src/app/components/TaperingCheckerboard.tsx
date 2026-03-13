"use client";

import { useEffect, useRef } from "react";

const TOP_COLS = 12;
const BOTTOM_COLS = 2;
const TAPER_ROWS = 6;
const BUFFER = 8;

function colsForRow(row: number): number {
  if (row >= TAPER_ROWS) return BOTTOM_COLS;
  return Math.round(
    TOP_COLS - ((TOP_COLS - BOTTOM_COLS) / (TAPER_ROWS - 1)) * row,
  );
}

/**
 * Full-bleed tapered checkerboard with a scroll-driven parallax shift and
 * color-mix transition (secondary ↔ secondary-foreground).
 *
 * Drop it inside any `relative overflow-hidden` container — it positions
 * itself with `absolute inset-0` and reads the parent's scroll position.
 */
export default function TaperingCheckerboard() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const wrapper = wrapperRef.current;
      const board = boardRef.current;
      if (!wrapper || !board) return;

      // How far the container top has scrolled above the viewport
      const s = Math.max(0, -wrapper.getBoundingClientRect().top);
      const t = Math.min(1, s / window.innerHeight);

      board.style.setProperty("--shift-r", `${s * 0.45}px`);
      board.style.setProperty("--shift-l", `${-s * 0.45}px`);
      board.style.setProperty("--t", `${t}`);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const lightBg = `color-mix(in oklch, var(--secondary) calc(100% * (1 - var(--t, 0))), var(--secondary-foreground))`;
  const darkBg = `color-mix(in oklch, var(--secondary-foreground) calc(100% * (1 - var(--t, 0))), var(--secondary))`;
  const rowH = `calc(100% / ${TAPER_ROWS})`;

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden">
      <div ref={boardRef} className="absolute inset-0 overflow-hidden">
        {Array.from({ length: TAPER_ROWS }).map((_, row) => {
          const cols = colsForRow(row);
          const cellW = `calc(100% / ${cols})`;
          const offset = `calc(${BUFFER} * 100% / ${cols})`;
          const varName = row % 2 === 0 ? "--shift-r" : "--shift-l";
          return (
            <div
              key={row}
              className="flex flex-none w-full"
              style={{
                height: rowH,
                transform: `translateX(calc(var(${varName}, 0px) - ${offset}))`,
              }}
            >
              {Array.from({ length: cols + BUFFER * 2 }).map((_, j) => {
                const isLight = (row + j) % 2 === 0;
                return (
                  <div
                    key={j}
                    className="flex-none h-full"
                    style={{
                      width: cellW,
                      backgroundColor: isLight ? lightBg : darkBg,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
