"use client";

import { useEffect, useRef } from "react";
import HeroText from "./HeroText";

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

export default function HomeHero() {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!boardRef.current) return;
      const s = window.scrollY;
      const t = Math.min(1, s / window.innerHeight);
      boardRef.current.style.setProperty("--shift-r", `${s * 0.45}px`);
      boardRef.current.style.setProperty("--shift-l", `${-s * 0.45}px`);
      boardRef.current.style.setProperty("--t", `${t}`);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const lightBg = `color-mix(in oklch, var(--secondary) calc(100% * (1 - var(--t, 0))), var(--secondary-foreground))`;
  const darkBg = `color-mix(in oklch, var(--secondary-foreground) calc(100% * (1 - var(--t, 0))), var(--secondary))`;

  const rowH = `calc(100vh / ${TAPER_ROWS})`;

  return (
    <section className="snap-start relative h-screen overflow-hidden">
      <div ref={boardRef} className="absolute inset-0 overflow-hidden">
        {Array.from({ length: TAPER_ROWS }).map((_, row) => {
          const cols = colsForRow(row);
          const cellW = `calc(100vw / ${cols})`;
          const offset = `calc(${BUFFER} * 100vw / ${cols})`;
          const varName = row % 2 === 0 ? "--shift-r" : "--shift-l";
          return (
            <div
              key={row}
              className="flex flex-none"
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

      {/* Hero text */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none mix-blend-difference ">
        <HeroText
          className="text-background text-4xl lg:text-8xl"
          texts={["Multisquared", "multi2", "multisquared", "Multi2"]}
        />
      </div>
    </section>
  );
}
