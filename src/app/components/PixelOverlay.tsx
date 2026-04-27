"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const GROW_MS = 500;
const FADE_MS = 300;
const MAX_BLUR = 48;
const GRID_MIN_COLS = 12;
const GRID_MAX_COLS = 36;
const GRID_CYCLE_MS = 280; // one full 12→36→12 oscillation

function easeIn(t: number) {
  return t * t;
}

function gridCellSize(elapsed: number): number {
  const t = elapsed / GRID_CYCLE_MS;
  // sine wave: starts at min, peaks at max, returns to min
  const cols =
    GRID_MIN_COLS +
    ((Math.sin(t * Math.PI * 2 - Math.PI / 2) + 1) / 2) *
      (GRID_MAX_COLS - GRID_MIN_COLS);
  return window.innerWidth / cols;
}

export default function PixelOverlay({ trigger }: { trigger: number }) {
  const divRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (trigger === 0) return;

    const el = divRef.current;
    if (!el) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    el.style.opacity = "1";
    el.style.transition = "none";
    el.style.display = "block";

    const start = performance.now();

    function grow(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / GROW_MS, 1);

      const blur = easeIn(t) * MAX_BLUR;
      const cell = gridCellSize(elapsed);

      el!.style.backdropFilter = `blur(${blur.toFixed(1)}px)`;
      el!.style.backgroundImage = [
        `linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px)`,
        `linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)`,
      ].join(",");
      el!.style.backgroundSize = `${cell.toFixed(1)}px ${cell.toFixed(1)}px`;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(grow);
      } else {
        el!.style.transition = `opacity ${FADE_MS}ms ease`;
        el!.style.opacity = "0";
        setTimeout(() => {
          el!.style.display = "none";
          el!.style.backdropFilter = "blur(0px)";
          el!.style.backgroundImage = "none";
        }, FADE_MS);
      }
    }

    rafRef.current = requestAnimationFrame(grow);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [trigger]);

  const overlay = (
    <div
      ref={divRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        display: "none",
        background: "rgba(0,0,0,0.25)",
        backdropFilter: "blur(0px)",
      }}
    />
  );

  return mounted ? createPortal(overlay, document.body) : null;
}
