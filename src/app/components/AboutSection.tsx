"use client";

import { useEffect, useRef, useState } from "react";
import HeroText from "./HeroText";

const ABOUT_TEXT =
  "Multi2 is a creative design studio based in Stockholm built on a simple idea: multiplication beats addition. Multi2 works across branding, digital design, creative direction, visual systems and interactive experiences — always with the same goal: to multiply what matters. Because the best ideas are rarely linear.";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [charProgress, setCharProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // 0 when section top is at viewport bottom, 1 when fully in view
      const progress = Math.max(
        0,
        Math.min(1, 1 - rect.top / window.innerHeight),
      );
      setCharProgress(progress);
      // rotate dots 0° → 45° during slide-in, continues past in view
      const rot = (1 - rect.top / window.innerHeight) * 45;
      el.style.setProperty("--rot", `${rot}deg`);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const displayedText = ABOUT_TEXT.slice(
    0,
    Math.round(charProgress * ABOUT_TEXT.length),
  );

  return (
    <section
      ref={sectionRef}
      className="snap-start relative h-screen bg-secondary flex items-center justify-center px-4 lg:px-8 overflow-hidden"
    >
      {/* Grid overlay — 6×8 mobile, 12×8 desktop */}
      <div
        className="hidden absolute inset-0 z-10 pointer-events-none  grid-cols-6 p-0"
        style={{ gridTemplateRows: "repeat(8, 1fr)" }}
      >
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="flex items-start justify-start">
            <span
              className="bg-secondary-foreground select-none w-2 h-2 inline-block"
              style={{ transform: "rotate(var(--rot, 0deg))" }}
            />
          </div>
        ))}
      </div>
      <div
        className="hidden absolute inset-0 z-10 pointer-events-none grid-cols-8 p-6"
        style={{ gridTemplateRows: "repeat(6, 1fr)" }}
      >
        {Array.from({ length: 96 }).map((_, i) => (
          <div key={i} className="flex items-start justify-start">
            <span
              className="bg-secondary-foreground select-none w-1.5 h-1.5 inline-block"
              style={{ transform: "rotate(var(--rot, 0deg))" }}
            />
          </div>
        ))}
      </div>

      {/* About text — scroll-driven: starts typing as section slides in */}
      <HeroText
        texts={[ABOUT_TEXT]}
        displayedText={displayedText}
        className="relative z-20 text-secondary-foreground text-4xl lg:text-5xl max-w-md lg:max-w-5xl leading-tight text-center"
      />
    </section>
  );
}
