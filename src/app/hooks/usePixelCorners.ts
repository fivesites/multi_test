"use client";

import { RefObject, useEffect, useRef } from "react";

type Options = {
  /** corner size as a fraction of the element's shorter side */
  ratio?: number;
  /** clamp: smallest corner in px */
  min?: number;
  /** clamp: largest corner in px */
  max?: number;
};

/**
 * Keeps the pixel-corner notches (the `.pixelCorners` mask) sized in proportion
 * to the element, staying square as the button grows or shrinks.
 *
 * Measures the element with a ResizeObserver and writes the result to the
 * `--pixel-size` custom property, which `.pixelCorners` reads for its
 * mask-border width. Same call works on any button — nothing is hard-coded to
 * a given size.
 *
 * Usage:
 *   const ref = usePixelCorners<HTMLButtonElement>();
 *   <button ref={ref} className="pixelCorners bg-primary …">connect</button>
 */
export function usePixelCorners<T extends HTMLElement>({
  ratio = 0.2,
  min = 4,
  max = 16,
}: Options = {}): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const size = Math.round(
        Math.min(max, Math.max(min, Math.min(width, height) * ratio)),
      );
      el.style.setProperty("--pixel-size", `${size}px`);
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ratio, min, max]);

  return ref;
}
