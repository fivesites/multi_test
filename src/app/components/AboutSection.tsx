"use client";

import { useEffect, useRef } from "react";
import { useXHeightSync } from "@/app/hooks/useXHeightSync";
import InlineTwoGlyph from "./InlineTwoGlyph";

/**
 * Renders a string, replacing every "(2)" with an inline superscript-2 glyph.
 * Falls back to plain "2" until xHeight is available.
 */
function TextWithTwoGlyph({
  text,
  xHeight,
}: {
  text: string;
  xHeight: number | null;
}) {
  const parts = text.split("(2)");
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 &&
            (xHeight !== null ? (
              <InlineTwoGlyph xHeight={xHeight} />
            ) : (
              "2"
            ))}
        </span>
      ))}
    </>
  );
}

const ABOUT_TEXT =
  "Multi(2) is not your typical company. It's a multiplier. Bring the challenge. Leave with multiplied impact. Two creators x multiple roles = more than expected. Strategy and execution under one roof. Ideas don't get diluted. They get sharper. Precision-crafted content. Built to deliver maximum impact per investment.";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const xHeight = useXHeightSync(measureRef);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rot =
        (1 - el.getBoundingClientRect().top / window.innerHeight) * 45;
      el.style.setProperty("--rot", `${rot}deg`);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="snap-start relative h-screen bg-secondary-foreground flex items-center justify-center px-4 lg:px-8 overflow-hidden"
    >
      {/* Hidden measurer — same font/size as the paragraph */}
      <span
        ref={measureRef}
        className="absolute invisible font-absolution1 text-2xl lg:text-5xl"
        aria-hidden="true"
      >
        x
      </span>

      <p className="relative z-20 text-secondary font-absolution1 text-2xl lg:text-5xl max-w-md lg:max-w-5xl leading-tight text-center inline-flex flex-wrap items-baseline justify-center">
        <TextWithTwoGlyph text={ABOUT_TEXT} xHeight={xHeight} />
      </p>
    </section>
  );
}
