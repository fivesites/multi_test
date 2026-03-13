"use client";

import { useRef } from "react";
import HeroText from "./HeroText";
import { useXHeightSync } from "@/app/hooks/useXHeightSync";
import InlineTwoGlyph from "./InlineTwoGlyph";

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
          className="text-secondary-foreground text-6xl font-rounded lg:text-8xl"
          texts={["Multi", "Jureskog", "Ikea", "ATG"]}
        />

        {xHeight !== null && (
          <span className="text-secondary-foreground">
            <InlineTwoGlyph xHeight={xHeight} />
          </span>
        )}
      </div>
    </section>
  );
}
