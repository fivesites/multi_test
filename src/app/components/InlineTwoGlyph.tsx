"use client";

// Tight bounding box of the "2" glyph (from 2_box.svg, background stripped)
const GLYPH_W = 65.7534;
const GLYPH_H = 106.849;
const GLYPH_ASPECT = GLYPH_W / GLYPH_H; // ≈ 0.615

const TWO_PATH =
  "M0 21.3699V0H43.8356V21.3699H0ZM65.7534 42.7397H43.8356V21.3699H65.7534V42.7397ZM43.8356 42.7397V64.1096H21.9178V42.7397H43.8356ZM65.7534 85.4795V106.849H0V64.1096H21.9178V85.4795H65.7534Z";

/**
 * Renders the "2" glyph inline at a size that matches the x-height of
 * adjacent text, with its bottom lifted to the x-height line (superscript).
 *
 * - Pass `xHeight` from `useXHeightSync` measured on a reference element
 *   that shares the same font and size as the surrounding text.
 * - Uses `fill="currentColor"` so it inherits the text color.
 */
export default function InlineTwoGlyph({ xHeight }: { xHeight: number }) {
  return (
    <svg
      width={xHeight * GLYPH_ASPECT}
      height={xHeight}
      viewBox={`0 0 ${GLYPH_W} ${GLYPH_H}`}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="inline-block flex-none"
      style={{
        // items-baseline puts the SVG bottom at the text baseline.
        // translateY(-xHeight) lifts it so the glyph bottom sits on the x-height line.
        transform: `translateY(${-xHeight}px)`,
      }}
    >
      <path d={TWO_PATH} />
    </svg>
  );
}
