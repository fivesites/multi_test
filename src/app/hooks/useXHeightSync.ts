"use client";

import { RefObject, useEffect, useState } from "react";

/**
 * Measures the x-height of the font on a given element using the Canvas API.
 * Returns the x-height in CSS pixels, or null before the font is ready.
 *
 * x-height = the ascent of a lowercase "x" from the baseline, which equals
 * the height of flat capitals like x, z, a, etc. Use this to size an inline
 * glyph so it visually matches the surrounding lowercase letterforms.
 *
 * Usage:
 *   const xHeight = useXHeightSync(ref);
 *   // render SVG at height={xHeight}, width={xHeight * glyphAspectRatio}
 *   // place inside flex items-baseline so SVG bottom = text baseline
 */
export function useXHeightSync(
  textRef: RefObject<HTMLElement | null>,
): number | null {
  const [xHeight, setXHeight] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const el = textRef.current;
      if (!el) return;

      const style = window.getComputedStyle(el);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Canvas font string requires "size family" order
      ctx.font = `${style.fontSize} ${style.fontFamily}`;
      const metrics = ctx.measureText("x");

      // actualBoundingBoxAscent = distance from baseline to top of "x" = x-height
      setXHeight(metrics.actualBoundingBoxAscent);
    };

    // Wait for web fonts to load before measuring to avoid fallback font metrics
    document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [textRef]);

  return xHeight;
}
