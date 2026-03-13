"use client";

import { useEffect, useRef } from "react";
import HeroText from "./HeroText";
import { useXHeightSync } from "@/app/hooks/useXHeightSync";

// Tight bounding box of the "2" glyph inside 2_box.svg's 300×300 viewBox
const GLYPH_W = 65.7534;
const GLYPH_H = 106.849;
const GLYPH_ASPECT = GLYPH_W / GLYPH_H; // ≈ 0.615

// The single path that draws the "2" (stripped from 2_box.svg, no background)
const TWO_PATH =
  "M0 21.3699V0H43.8356V21.3699H0ZM65.7534 42.7397H43.8356V21.3699H65.7534V42.7397ZM43.8356 42.7397V64.1096H21.9178V42.7397H43.8356ZM65.7534 85.4795V106.849H0V64.1096H21.9178V85.4795H65.7534Z";

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

  // Ref on a hidden span that carries the same font as HeroText
  const measureRef = useRef<HTMLSpanElement>(null);
  const xHeight = useXHeightSync(measureRef);

  useEffect(() => {
    const update = () => {
      if (!boardRef.current || !sectionRef.current) return;
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
    <section
      ref={sectionRef}
      className="snap-start relative h-screen overflow-hidden"
    >
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

      {/* Hidden measurer — same font class as HeroText, invisible but measured */}
      <span
        ref={measureRef}
        className="absolute invisible font-absolution1 text-6xl lg:text-8xl"
        aria-hidden="true"
      >
        x
      </span>

      <div className="absolute inset-0 z-10 flex items-baseline justify-center pointer-events-none">
        <HeroText
          className="text-white text-6xl lg:text-8xl [text-shadow:0_0_40px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.8)]"
          texts={["Multi", "Jureskog", "Ikea", "ATG"]}
        />

        {/*
          Inline SVG with tight viewBox (glyph only, no background).
          Height = x-height of adjacent text → glyph spans exactly baseline → x-height.
          Width = height × glyph aspect ratio.
          fill="currentColor" inherits the white text color.
          items-baseline on parent aligns SVG bottom with text baseline.
        */}
        {xHeight !== null && (
          <svg
            width={xHeight * GLYPH_ASPECT}
            height={xHeight}
            viewBox={`0 0 ${GLYPH_W} ${GLYPH_H}`}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white flex-none"
            aria-hidden="true"
            style={{
              // items-baseline puts SVG bottom at the text baseline.
              // translateY(-xHeight) then lifts it up by one x-height,
              // so the glyph bottom lands exactly on the x-height line (superscript).
              transform: `translateY(${-xHeight}px)`,
              filter:
                "drop-shadow(0 0 40px rgba(0,0,0,0.6)) drop-shadow(0 2px 8px rgba(0,0,0,0.8))",
            }}
          >
            <path d={TWO_PATH} />
          </svg>
        )}
      </div>
    </section>
  );
}
