"use client";

import { useId } from "react";

export type BorderSize = "xs" | "s" | "m" | "l" | "xl";

// cellPx scales with size — larger border = larger cells, fewer visible
const CELL_PX: Record<BorderSize, number> = {
  xs: 16,   // border: 32px
  s:  32,   // border: 64px
  m:  64,   // border: 128px
  l:  128,  // border: 256px
  xl: 240,  // border: 480px
};

interface Props {
  size?: BorderSize;
}

export default function VerticalBorder({ size = "s" }: Props) {
  const uid = useId();
  const cellPx = CELL_PX[size];
  const tileSize = cellPx * 2; // full checkerboard tile = 2×2 cells
  const borderW = tileSize;
  const patId = `vb-${uid}`;
  const svgH = 4000;

  return (
    <svg
      width={borderW}
      height="100%"
      viewBox={`0 0 ${borderW} ${svgH}`}
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <pattern id={patId} x="0" y="0" width={tileSize} height={tileSize} patternUnits="userSpaceOnUse">
          <rect width={tileSize} height={tileSize} fill="var(--accent)" />
          <rect x="0" y="0" width={cellPx} height={cellPx} fill="var(--accent)" style={{ mixBlendMode: "difference" }} />
          <rect x={cellPx} y={cellPx} width={cellPx} height={cellPx} fill="var(--accent)" style={{ mixBlendMode: "difference" }} />
        </pattern>
      </defs>
      <rect width={borderW} height={svgH} fill={`url(#${patId})`} />
    </svg>
  );
}
