"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import HeroText from "@/app/components/HeroText";

// No SSR — avoids Radix UI aria-controls hydration mismatch
const WorkGridClient = dynamic(
  () => import("./WorkGridClient").then((m) => ({ default: m.WorkGridClient })),
  { ssr: false },
);

type Work = {
  _id: string;
  title: string;
  slug: { current: string };
  client?: string;
  year?: number;
  categories?: string[];
  backgroundColor?: string;
  coverImage?: { asset: { _ref: string }; hotspot?: object; crop?: object };
};

export function WorkPageClient({ works }: { works: Work[] }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const p = Math.min(1, el.scrollTop / window.innerHeight);
      setProgress(p);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const blur = (1 - progress) * 14;
  const textOpacity = Math.max(0, 1 - progress * 2.5);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll"
      style={{ scrollSnapType: "none" }}
    >
      <div style={{ height: "200vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Blurred grid */}
          <div
            style={{
              filter: `blur(${blur}px)`,
              transition: "filter 0.1s linear",
              height: "100%",
            }}
          >
            <WorkGridClient works={works} />
          </div>

          {/* "Work" intro text */}
          {textOpacity > 0 && (
            <div
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
              style={{ opacity: textOpacity }}
            >
              <HeroText
                className="text-foreground text-7xl lg:text-9xl"
                texts={["Work"]}
                displayedText="Work"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
