"use client";

import { useEffect, useRef } from "react";
import HeroText from "./HeroText";

const ABOUT_TEXT =
  "Multi2 is not your typical company. It’s a multiplier. Bring the challenge. Leave with multiplied impact. Two creators x multiple roles = more than expected. Strategy and execution under one roof. Ideas don’t get diluted. They get sharper. Precision-crafted content. Built to deliver maximum impact per investment.";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      // rotate dots 0° → 45° during slide-in
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
      <HeroText
        texts={[ABOUT_TEXT]}
        triggerOnView={true}
        className="relative z-20 text-secondary text-2xl lg:text-5xl max-w-md lg:max-w-5xl leading-tight text-center"
      />
    </section>
  );
}
