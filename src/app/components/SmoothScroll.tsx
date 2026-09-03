"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/**
 * Site-wide smooth scrolling. Lenis intercepts wheel/touch and eases the real
 * document scroll, so native scroll position (and anything reading it —
 * IntersectionObserver, `useInView`, hash links) keeps working.
 *
 * Bows out for visitors who prefer reduced motion: they get the browser's
 * plain scroll.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        // Gentle exponential ease-out — quick to respond, soft to land.
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.6,
      }}
    >
      {children}
    </ReactLenis>
  );
}
