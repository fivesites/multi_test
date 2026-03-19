"use client";

import { useId } from "react";

export type BorderSize = "xs" | "s" | "m" | "l" | "xl";

// cellPx scales with size — larger border = larger cells, fewer visible
const CELL_PX: Record<BorderSize, number> = {
  xs: 16,   // border: 32px  (~180 cells @ 1440px)
  s:  32,   // border: 64px  (~45 cells)
  m:  64,   // border: 128px (~22 cells)
  l:  128,  // border: 256px (~11 cells)
  xl: 240,  // border: 480px (~6 cells)
};

interface Props {
  size?: BorderSize;
}

export default function HorizontalBorder({ size = "s" }: Props) {
  const uid = useId();
  const cellPx = CELL_PX[size];
  const tileSize = cellPx * 2; // full checkerboard tile = 2×2 cells
  const borderH = tileSize;
  const patId = `hb-${uid}`;
  const svgW = 4000;

  return (
    <svg
      width="100%"
      height={borderH}
      viewBox={`0 0 ${svgW} ${borderH}`}
      preserveAspectRatio="xMinYMid slice"
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
      <rect width={svgW} height={borderH} fill={`url(#${patId})`} />
    </svg>
  );
}
