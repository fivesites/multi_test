"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  // Sanity Studio is a fixed full-viewport app with its own scroll panes;
  // Lenis intercepting wheel/touch stops those panes from scrolling.
  if (reduce || pathname?.startsWith("/studio")) return <>{children}</>;

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
