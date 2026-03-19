"use client";

import {
  type SavedTwo,
  getCellDimensions,
  renderTwoShapes,
} from "@/app/lib/twoUtils";

// Tight bounding box of the default "2" glyph (from 2_box.svg)
const GLYPH_W = 65.7534;
const GLYPH_H = 106.849;
const GLYPH_ASPECT = GLYPH_W / GLYPH_H; // ≈ 0.615

const TWO_PATH =
  "M0 21.3699V0H43.8356V21.3699H0ZM65.7534 42.7397H43.8356V21.3699H65.7534V42.7397ZM43.8356 42.7397V64.1096H21.9178V42.7397H43.8356ZM65.7534 85.4795V106.849H0V64.1096H21.9178V85.4795H65.7534Z";

const INNER_CELL_PX = 10; // unit size for viewBox — doesn't affect visual output

/**
 * Renders the "2" glyph inline, sized to match the x-height of adjacent text.
 * Accepts an optional `custom` saved design from the TwoGenerator — if provided,
 * renders that design instead of the default path glyph.
 */
export default function InlineTwoGlyph({
  xHeight,
  custom,
}: {
  xHeight: number;
  custom?: SavedTwo;
}) {
  let svgContent: React.ReactNode;
  let viewBoxW: number;
  let viewBoxH: number;
  let aspect: number;

  if (custom) {
    const { cellW, cellH } = getCellDimensions(custom.style, INNER_CELL_PX);
    viewBoxW = custom.cols * cellW;
    viewBoxH = custom.rows * cellH;
    aspect = viewBoxW / viewBoxH;
    svgContent = renderTwoShapes(
      custom.cells,
      custom.style,
      cellW,
      cellH,
      custom.noGap,
      custom.asset,
    );
  } else {
    viewBoxW = GLYPH_W;
    viewBoxH = GLYPH_H;
    aspect = GLYPH_ASPECT;
    svgContent = <path d={TWO_PATH} />;
  }

  const w = xHeight * aspect;

  return (
    <span
      aria-hidden="true"
      style={{
        marginLeft: 2,
        display: "inline-block",
        position: "relative",
        width: w,
        height: 0,
        overflow: "visible",
        verticalAlign: "baseline",
      }}
    >
      <svg
        width={w}
        height={xHeight}
        viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          bottom: xHeight,
          left: 2,
        }}
      >
        {svgContent}
      </svg>
    </span>
  );
}
