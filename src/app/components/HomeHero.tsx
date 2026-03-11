"use client";

import { useEffect, useRef, useState } from "react";
import ProjectSection from "./ProjectSection";
import HeroText from "./HeroText";
import Carousel from "./Carousel";

const ABOUT_TEXT =
  "Multi2 is a creative design studio based in Stockholm built on a simple idea: multiplication beats addition. Multi2 works across branding, digital design, creative direction, visual systems and interactive experiences — always with the same goal: to multiply what matters. Because the best ideas are rarely linear.";

export default function HomeHero() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [unblurred, setUnblurred] = useState(false);

  useEffect(() => {
    const update = () => {
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = el.offsetHeight - window.innerHeight;
      setProgress(Math.max(0, Math.min(1, scrolled / total)));
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Phase 1 (progress 0):    HeroText cycling (time-based)
  // Transition (0.01–0.05):  HeroText fades out, about text fades in
  // Phase 2 (0.03–0.88):     ABOUT_TEXT types out scroll-driven
  // Phase 3 (0.88–1.0):      Fully typed, blurred carousel remains
  const scrolled = progress > 0.01;
  const heroTextOpacity = scrolled
    ? Math.max(0, 1 - (progress - 0.01) / 0.04)
    : 1;
  const aboutTextOpacity = scrolled ? Math.min(1, (progress - 0.01) / 0.04) : 0;
  const aboutCharsProgress = scrolled
    ? Math.min(1, (progress - 0.03) / 0.85)
    : 0;
  const displayedAbout = ABOUT_TEXT.slice(
    0,
    Math.max(0, Math.round(aboutCharsProgress * ABOUT_TEXT.length)),
  );

  const blurPx = unblurred ? 0 : 14;

  const lensMask = mousePos
    ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, transparent 80px, black 180px)`
    : undefined;

  return (
    <>
      <div ref={outerRef} style={{ height: "350vh" }}>
        <div
          ref={stickyRef}
          className="sticky top-0 h-screen overflow-hidden cursor-pointer"
          onMouseMove={(e) => {
            if (unblurred) return;
            const rect = stickyRef.current?.getBoundingClientRect();
            if (rect)
              setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              });
          }}
          onMouseLeave={() => setMousePos(null)}
          onClick={() => setUnblurred(true)}
        >
          {/* Carousel — autoplaying behind everything, blur managed here */}
          <Carousel disableBlur />

          {/* Blur overlay with cursor lens cutout — always on until clicked */}
          {blurPx > 0 && (
            <div
              className="absolute inset-0 z-[5] pointer-events-none"
              style={{
                backdropFilter: `blur(${blurPx}px)`,
                WebkitBackdropFilter: `blur(${blurPx}px)`,
                maskImage: lensMask,
                WebkitMaskImage: lensMask,
              }}
            />
          )}

          {/* Phase 1: HeroText cycling — fades out when scroll starts */}
          <div
            className="absolute inset-0 z-20 flex items-center justify-start px-6 pointer-events-none  "
            style={{ opacity: heroTextOpacity }}
          >
            <HeroText
              className="text-white text-4xl lg:text-9xl mix-blend-difference   "
              texts={["Multisquared", "multi2", "multisquared", "Multi2"]}
            />
          </div>

          {/* Phase 2: ABOUT_TEXT scroll-driven — same HeroText component */}
          <div
            className="absolute inset-0 z-20 flex items-center justify-start px-6 pointer-events-none"
            style={{ opacity: aboutTextOpacity }}
          >
            <HeroText
              texts={[ABOUT_TEXT]}
              displayedText={displayedAbout}
              className="text-white text-4xl lg:text-5xl mix-blend-difference max-w-4xl leading-tight tracking-wide"
            />
          </div>

          {/* Grid overlay — 3×4 mobile, 12×8 desktop */}
          <div
            className="md:hidden absolute inset-0 z-10 pointer-events-none grid grid-cols-6 p-6"
            style={{ gridTemplateRows: "repeat(8, 1fr)" }}
          >
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="flex items-start justify-start">
                <span className="bg-white select-none w-1 h-1"></span>
              </div>
            ))}
          </div>
          <div
            className="hidden md:grid absolute inset-0 z-10 pointer-events-none grid-cols-12 p-6"
            style={{ gridTemplateRows: "repeat(8, 1fr)" }}
          >
            {Array.from({ length: 96 }).map((_, i) => (
              <div key={i} className="flex items-start justify-start">
                <span className="bg-white select-none w-1 h-1"></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ProjectSection — snap target after hero sequence */}
      <ProjectSection />
    </>
  );
}
