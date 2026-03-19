import { renderTwoShapes, getCellDimensions } from "@/app/lib/twoUtils";

// ── Types ─────────────────────────────────────────────────────────────────────

export type GlyphStyle  = "square" | "circle" | "stretch-h" | "stretch-v" | "image" | "svg";
export type CheckerMode = "square" | "strip-h" | "strip-v";
export type AssetMode   = "glyph" | "pattern" | "strip-h" | "strip-v" | "composition";

export type SavedAsset = {
  id: string;
  label: string;
  type: AssetMode;
  // drawing — always present
  cells: boolean[][];
  glyphStyle: GlyphStyle;
  noGap: boolean;
  cols: number;
  rows: number;
  uploadedAsset?: string;
  // pattern settings (when type !== "glyph")
  colorA?: string;
  colorB?: string;
  checkerStripCount?: number;
};

// ── Size ladders ──────────────────────────────────────────────────────────────

export const ASSET_SIZES = [
  { label: "xs",  px: 16   },
  { label: "s",   px: 32   },
  { label: "m",   px: 64   },
  { label: "l",   px: 128  },
  { label: "xl",  px: 256  },
  { label: "2xl", px: 512  },
  { label: "3xl", px: 1024 },
  { label: "4xl", px: 1440 },
] as const;

export const STRIP_SIZES = [
  { label: "xs",  count: 1 },
  { label: "s",   count: 2 },
  { label: "m",   count: 3 },
  { label: "l",   count: 4 },
  { label: "xl",  count: 5 },
  { label: "2xl", count: 6 },
] as const;

// ── Default glyph cells ───────────────────────────────────────────────────────

export const DEFAULT_TWO_CELLS: boolean[][] = [
  [false, true,  true,  true,  true,  false, false],
  [true,  false, false, false, false, true,  false],
  [false, false, false, false, false, true,  false],
  [false, false, false, false, true,  false, false],
  [false, false, false, true,  false, false, false],
  [false, false, true,  false, false, false, false],
  [false, true,  false, false, false, false, false],
  [false, false, false, false, false, false, false],
  [true,  true,  true,  true,  true,  true,  false],
];

export const DEFAULT_M_CELLS: boolean[][] = [
  [true,  false, false, false, false, false, true ],
  [true,  true,  false, false, false, true,  true ],
  [true,  false, true,  false, true,  false, true ],
  [true,  false, false, true,  false, false, true ],
  [true,  false, false, false, false, false, true ],
  [true,  false, false, false, false, false, true ],
  [true,  false, false, false, false, false, true ],
];

// ── Render helpers ────────────────────────────────────────────────────────────

/** Glyph shapes as React JSX (uses currentColor, set color on parent) */
export function renderGlyphShapes(
  asset: Pick<SavedAsset, "cells" | "glyphStyle" | "noGap" | "uploadedAsset">,
  cellPx: number,
) {
  const { cells = [], glyphStyle = "square", noGap = false, uploadedAsset } = asset;
  const { cellW, cellH } = getCellDimensions(glyphStyle, cellPx);
  return renderTwoShapes(cells, glyphStyle, cellW, cellH, noGap, uploadedAsset);
}

/** Glyph SVG dimensions at a given cellPx */
export function glyphDims(
  cols: number,
  rows: number,
  glyphStyle: GlyphStyle,
  cellPx: number,
): { w: number; h: number } {
  const { cellW, cellH } = getCellDimensions(glyphStyle, cellPx);
  return { w: cols * cellW, h: rows * cellH };
}

/**
 * Pattern SVG dimensions:
 *  - square:  sizePx × sizePx
 *  - strip-h: 1440 × (stripCount × glyphH)
 *  - strip-v: (stripCount × glyphW) × 1440
 */
export function patternDims(
  mode: CheckerMode,
  glyphW: number,
  glyphH: number,
  stripCount: number,
  sizePx: number,
): { w: number; h: number } {
  if (mode === "strip-h") return { w: 1440,                  h: stripCount * glyphH };
  if (mode === "strip-v") return { w: stripCount * glyphW,   h: 1440                };
  return { w: sizePx, h: sizePx };
}

/** Pattern tile dimensions for SVG <pattern> element */
export function patternTileDims(
  _mode: CheckerMode,
  glyphW: number,
  glyphH: number,
): { tileW: number; tileH: number; offsets: { x: number; y: number }[] } {
  // All modes use the same checkerboard tile — only canvas size differs
  return {
    tileW: glyphW * 2, tileH: glyphH * 2,
    offsets: [{ x: 0, y: 0 }, { x: glyphW, y: glyphH }],
  };
}

// ── SVG string export ─────────────────────────────────────────────────────────

function buildShapeStrings(
  cells: boolean[][],
  glyphStyle: GlyphStyle,
  cellW: number,
  cellH: number,
  noGap: boolean,
  uploadedAsset?: string,
): string[] {
  const GAP = noGap ? 0 : Math.min(cellW, cellH) * 0.05;
  // When noGap, add a thin stroke so contiguous cells have visible borders
  const strokeAttr = noGap ? ` stroke="currentColor" stroke-width="0.5" stroke-opacity="0.2"` : "";
  const out: string[] = [];
  cells.forEach((row, r) =>
    row.forEach((active, c) => {
      if (!active) return;
      const x = c * cellW, y = r * cellH;
      if (glyphStyle === "circle") {
        out.push(`<circle cx="${x+cellW/2}" cy="${y+cellH/2}" r="${Math.min(cellW,cellH)/2-GAP}" fill="currentColor"${strokeAttr}/>`);
      } else if ((glyphStyle === "image" || glyphStyle === "svg") && uploadedAsset) {
        out.push(`<image href="${uploadedAsset}" x="${x+GAP}" y="${y+GAP}" width="${cellW-GAP*2}" height="${cellH-GAP*2}" preserveAspectRatio="xMidYMid slice"/>`);
      } else {
        out.push(`<rect x="${x+GAP}" y="${y+GAP}" width="${cellW-GAP*2}" height="${cellH-GAP*2}" fill="currentColor"${strokeAttr}/>`);
      }
    }),
  );
  return out;
}

export function exportAssetSvg(asset: SavedAsset, sizePx = 256): string {
  const { cols, rows, glyphStyle = "square", noGap = true, cells = [], uploadedAsset } = asset;
  const scaledCell = sizePx / Math.max(cols, rows);
  const { cellW, cellH } = getCellDimensions(glyphStyle, scaledCell);
  const gW = cols * cellW;
  const gH = rows * cellH;
  const shapes = buildShapeStrings(cells, glyphStyle, cellW, cellH, noGap, uploadedAsset);

  if (asset.type === "glyph") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${gW}" height="${gH}" viewBox="0 0 ${gW} ${gH}">${shapes.join("")}</svg>`;
  }

  const mode: CheckerMode = asset.type === "pattern" ? "square" : asset.type as CheckerMode;
  const stripCount  = asset.checkerStripCount ?? 2;
  const colorA      = asset.colorA            ?? "#000000";
  const colorB      = asset.colorB            ?? "#ffffff";
  const { w: svgW, h: svgH } = patternDims(mode, gW, gH, stripCount, sizePx);
  const { tileW, tileH, offsets } = patternTileDims(mode, gW, gH);

  const glyphInstances = offsets.map(({ x, y }) =>
    `<g style="color:${colorA}" transform="translate(${x},${y})">${shapes.join("")}</g>`,
  ).join("");

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">` +
    `<defs><pattern id="pg" x="0" y="0" width="${tileW}" height="${tileH}" patternUnits="userSpaceOnUse">` +
    `<rect width="${tileW}" height="${tileH}" fill="${colorB}"/>` +
    glyphInstances +
    `</pattern></defs>` +
    `<rect width="${svgW}" height="${svgH}" fill="url(#pg)"/>` +
    `</svg>`
  );
}
