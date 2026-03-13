"use client";

import { useRef } from "react";
import HeroText from "./HeroText";
import { useXHeightSync } from "@/app/hooks/useXHeightSync";

// Tight bounding box of the "2" glyph inside 2_box.svg's 300×300 viewBox
const GLYPH_W = 65.7534;
const GLYPH_H = 106.849;
const GLYPH_ASPECT = GLYPH_W / GLYPH_H; // ≈ 0.615

// The single path that draws the "2" (stripped from 2_box.svg, no background)
const TWO_PATH =
  "M0 21.3699V0H43.8356V21.3699H0ZM65.7534 42.7397H43.8356V21.3699H65.7534V42.7397ZM43.8356 42.7397V64.1096H21.9178V42.7397H43.8356ZM65.7534 85.4795V106.849H0V64.1096H21.9178V85.4795H65.7534Z";

export default function HomeHero() {
  const measureRef = useRef<HTMLSpanElement>(null);
  const xHeight = useXHeightSync(measureRef);

  return (
    <section className="snap-start relative h-screen bg-secondary overflow-hidden flex items-center justify-center">
      {/* Hidden measurer — same font/size as HeroText */}
      <span
        ref={measureRef}
        className="absolute invisible font-absolution1 text-6xl lg:text-8xl"
        aria-hidden="true"
      >
        x
      </span>

      <div className="flex items-baseline justify-center pointer-events-none">
        <HeroText
          className="text-secondary-foreground text-6xl lg:text-8xl"
          texts={["Multi", "Jureskog", "Ikea", "ATG"]}
        />

        {xHeight !== null && (
          <svg
            width={xHeight * GLYPH_ASPECT}
            height={xHeight}
            viewBox={`0 0 ${GLYPH_W} ${GLYPH_H}`}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="text-secondary-foreground flex-none"
            aria-hidden="true"
            style={{ transform: `translateY(${-xHeight}px)` }}
          >
            <path d={TWO_PATH} />
          </svg>
        )}
      </div>
    </section>
  );
}
