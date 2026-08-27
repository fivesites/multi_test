"use client";

import { useEffect, useState } from "react";

const ROWS = [1, 2, 3, 4, 5, 6, 7, 8];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * Development helper: the site grid drawn over the whole viewport, so spacing
 * and alignment can be eyeballed against a baseline.
 *
 * Three layers, all fed by the grid variables in globals.css:
 *  - 1px separators on the top and bottom edge of each of the 8 rows
 *  - 1px separators on the left and right edge of each column (2 on mobile,
 *    12 from lg up)
 *  - an optional point grid
 *
 * Everything sits inside `p-grid`, the same inset the `.rows` / `.cols`
 * containers use, so the overlay can't drift from the utilities.
 *
 * Toggle with the `g` key (ignored while typing in a field). Renders nothing in
 * production unless `force` is set.
 */
export default function GridOverlay({
  size = 12,
  dotSize = 1.5,
  color = "#000",
  opacity = 1,
  rows = true,
  cols = true,
  dots = false,
  rowColor = "color-mix(in oklab, var(--destructive) 60%, transparent)",
  colColor = "color-mix(in oklab, var(--destructive) 30%, transparent)",
  defaultOn = true,
  force = false,
}: {
  /** Grid pitch in px, both axes. */
  size?: number;
  /** Diameter of each point in px. */
  dotSize?: number;
  color?: string;
  opacity?: number;
  /** Draw the row separators. */
  rows?: boolean;
  /** Draw the column separators. */
  cols?: boolean;
  /** Draw the point grid. */
  dots?: boolean;
  rowColor?: string;
  colColor?: string;
  defaultOn?: boolean;
  /** Render outside development too. */
  force?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "g" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (
        el?.isContentEditable ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName ?? "")
      )
        return;
      setOn((v) => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!force && process.env.NODE_ENV === "production") return null;
  if (!on) return null;

  // Unique per geometry so several overlays can coexist without id collisions.
  const patternId = `grid-dots-${size}-${dotSize}`;

  return (
    // pointer-events-none is what makes the overlay inert: clicks, hovers and
    // scrolls all land on whatever sits underneath it.
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-dvh w-full"
      style={{ opacity }}
    >
      {dots ? (
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            <pattern
              id={patternId}
              width={size}
              height={size}
              patternUnits="userSpaceOnUse"
            >
              {/* Centred in the cell, so the pitch reads the same from every edge. */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={dotSize / 2}
                fill={color}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      ) : null}

      {rows || cols ? (
        // The margin lives on this wrapper, so the separators span the same box
        // the `.rows` / `.cols` containers do — and the column measures, which
        // are percentages, resolve against that same width.
        <div className="absolute inset-0 p-grid">
          <div className="relative h-full w-full">
            {cols
              ? COLS.map((n) => (
                  <div
                    key={`col-${n}`}
                    // Only 2 columns exist below lg; the rest would sit on top
                    // of each other, so they stay hidden until the grid widens.
                    className={`absolute top-0 h-full w-col-1 ${
                      n > 2 ? "hidden lg:block" : ""
                    }`}
                    style={{
                      left: n === 1 ? 0 : `calc(${n - 1} * var(--col-step))`,
                      // Left and right edge of the column; the untouched space
                      // between two columns is the gap.
                      borderLeft: `1px solid ${colColor}`,
                      borderRight: `1px solid ${colColor}`,
                    }}
                  >
                    <span
                      className="absolute bottom-0 left-0 px-1 font-diatype text-[10px] leading-none"
                      style={{ color: colColor }}
                    >
                      {n}
                    </span>
                  </div>
                ))
              : null}

            {rows
              ? ROWS.map((n) => (
                  <div
                    key={`row-${n}`}
                    className="absolute left-0 h-row-1 w-full"
                    style={{
                      top: n === 1 ? 0 : `calc(${n - 1} * var(--row-step))`,
                      // Top and bottom edge of the row; the untouched space
                      // between two rows is the gap.
                      borderTop: `1px solid ${rowColor}`,
                      borderBottom: `1px solid ${rowColor}`,
                    }}
                  >
                    <span
                      className="absolute top-0 left-0 px-1 font-diatype text-[10px] leading-none"
                      style={{ color: rowColor }}
                    >
                      {n}
                    </span>
                  </div>
                ))
              : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
