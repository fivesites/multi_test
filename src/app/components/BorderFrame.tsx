"use client";

import HorizontalBorder, { type BorderSize } from "./HorizontalBorder";
import VerticalBorder from "./VerticalBorder";

const CELL_PX: Record<BorderSize, number> = {
  xs: 16,
  s:  32,
  m:  64,
  l:  128,
  xl: 240,
};

// Predefined class strings so Tailwind v4 scanner picks them up
const COL_CLASS: Record<BorderSize, string> = {
  xs: "[grid-template-columns:0px_1fr_0px] lg:[grid-template-columns:32px_1fr_32px]",
  s:  "[grid-template-columns:0px_1fr_0px] lg:[grid-template-columns:64px_1fr_64px]",
  m:  "[grid-template-columns:0px_1fr_0px] lg:[grid-template-columns:128px_1fr_128px]",
  l:  "[grid-template-columns:0px_1fr_0px] lg:[grid-template-columns:256px_1fr_256px]",
  xl: "[grid-template-columns:0px_1fr_0px] lg:[grid-template-columns:480px_1fr_480px]",
};

const ROW_CLASS: Record<BorderSize, string> = {
  xs: "[grid-template-rows:32px_1fr_32px]",
  s:  "[grid-template-rows:64px_1fr_64px]",
  m:  "[grid-template-rows:128px_1fr_128px]",
  l:  "[grid-template-rows:256px_1fr_256px]",
  xl: "[grid-template-rows:480px_1fr_480px]",
};

function Corner({ cellPx }: { cellPx: number }) {
  const s = cellPx * 2;
  return (
    <svg width={s} height={s} aria-hidden="true" style={{ display: "block" }}>
      <rect width={s} height={s} fill="var(--accent)" />
      <rect x={0} y={0} width={cellPx} height={cellPx} fill="var(--accent)" style={{ mixBlendMode: "difference" }} />
      <rect x={cellPx} y={cellPx} width={cellPx} height={cellPx} fill="var(--accent)" style={{ mixBlendMode: "difference" }} />
    </svg>
  );
}

interface Props {
  size?: BorderSize;
  children: React.ReactNode;
  className?: string;
}

export default function BorderFrame({ size = "xs", children, className }: Props) {
  const cellPx = CELL_PX[size];

  return (
    <div className={`grid ${COL_CLASS[size]} ${ROW_CLASS[size]} ${className ?? ""}`}>

      {/* Top row — explicit placement so hidden never breaks auto-flow */}
      <div style={{ gridColumn: 1, gridRow: 1 }} className="hidden lg:block overflow-hidden">
        <Corner cellPx={cellPx} />
      </div>
      <div style={{ gridColumn: 2, gridRow: 1 }}>
        <HorizontalBorder size={size} />
      </div>
      <div style={{ gridColumn: 3, gridRow: 1 }} className="hidden lg:block overflow-hidden">
        <Corner cellPx={cellPx} />
      </div>

      {/* Middle row */}
      <div style={{ gridColumn: 1, gridRow: 2 }} className="hidden lg:block overflow-hidden h-full">
        <VerticalBorder size={size} />
      </div>
      <div style={{ gridColumn: 2, gridRow: 2 }} className="relative overflow-hidden min-h-0">
        {children}
      </div>
      <div style={{ gridColumn: 3, gridRow: 2 }} className="hidden lg:block overflow-hidden h-full">
        <VerticalBorder size={size} />
      </div>

      {/* Bottom row */}
      <div style={{ gridColumn: 1, gridRow: 3 }} className="hidden lg:block overflow-hidden">
        <Corner cellPx={cellPx} />
      </div>
      <div style={{ gridColumn: 2, gridRow: 3 }}>
        <HorizontalBorder size={size} />
      </div>
      <div style={{ gridColumn: 3, gridRow: 3 }} className="hidden lg:block overflow-hidden">
        <Corner cellPx={cellPx} />
      </div>

    </div>
  );
}
