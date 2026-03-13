"use client";

import { useEffect, useRef } from "react";
import { useXHeightSync } from "@/app/hooks/useXHeightSync";
import InlineTwoGlyph from "./InlineTwoGlyph";
import Image from "next/image";

/**
 * Renders a string, replacing every "word(2)" with a styled span around
 * "word" (using `className`) followed by an inline superscript-2 glyph.
 * Falls back to plain "2" until xHeight is available.
 */
function TextWithTwoGlyph({
  text,
  xHeight,
  className,
}: {
  text: string;
  xHeight: number | null;
  className?: string;
}) {
  // Split captures the word immediately before each (2) as its own segment
  const segments = text.split(/(\w+)\(2\)/);
  return (
    <>
      {segments.map((seg, i) => {
        const isClientName = i % 2 === 1;
        return (
          <span key={i} className={isClientName ? className : undefined}>
            {seg}
            {isClientName &&
              (xHeight !== null ? <InlineTwoGlyph xHeight={xHeight} /> : "2")}
          </span>
        );
      })}
    </>
  );
}

const ABOUT_TEXT =
  "Multi² is not your typical company. It’s a multiplier. Bring the challenge. Leave with multiplied impact. Two creators × multiple roles = more than expected. Strategy and execution under one roof. Ideas don’t get diluted. They get sharper. Precision-crafted content, built to deliver maximum impact per investment. From sharpening the brand at IKEA² to crafting bold work with Jureskog² and ATG², we help brands move faster, think clearer, and create more with less. Small team. Multiplied output.";

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
      className="snap-start relative min-h-[75vh] grid grid-cols-1 lg:grid-cols-3 items-start justify-start overflow-hidden bg-background w-full"
    >
      {/* Hidden measurer — same font/size as the paragraph */}
      <span
        ref={measureRef}
        className="absolute invisible font-rounded text-2xl lg:text-3xl"
        aria-hidden="true"
      >
        x
      </span>

      <p className="relative z-20 col-span-1 text-foreground font-rounded font-normal leading-tight text-2xl lg:text-2xl inline-flex flex-wrap items-baseline justify-start p-3">
        {ABOUT_TEXT}
      </p>
      <div className="hidden lg:block lg:col-span-2 relative h-full">
        <Image
          src="/jureskogs/reklam_dokumentation_2503_Jureskogs_237_TUSCH.jpg"
          alt=""
          fill
          className="object-cover object-right"
        />
      </div>
    </section>
  );
}
