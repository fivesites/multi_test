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
  const sectionRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!boardRef.current || !sectionRef.current) return;
      // s = how far the section has scrolled past the top of the viewport
      const s = Math.max(0, -sectionRef.current.getBoundingClientRect().top);
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
    <section ref={sectionRef} className="snap-start relative h-screen overflow-hidden">
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

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <HeroText
          className="text-white text-6xl lg:text-8xl [text-shadow:0_0_40px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.8)]"
          texts={[
            "Multisquared",
            "multi2",
            "multisquared",
            "Multi2",
            "MULTISQUARED",
            "MULTI2",
          ]}
        />
      </div>
    </section>
  );
}
