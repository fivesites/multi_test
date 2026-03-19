import { JSX } from "react";

export type TwoStyle = "square" | "circle" | "stretch-h" | "stretch-v" | "image" | "svg";

export type SavedTwo = {
  id: string;
  label: string;
  cells: boolean[][];
  style: TwoStyle;
  noGap: boolean;
  cols: number;
  rows: number;
  asset?: string; // data URL for image/svg style
};

export function getCellDimensions(style: TwoStyle, cellPx: number) {
  const cellW =
    style === "stretch-h" ? cellPx * 1.8 :
    style === "stretch-v" ? cellPx * 0.6 :
    cellPx;
  const cellH = style === "stretch-v" ? cellPx * 1.8 : cellPx;
  return { cellW, cellH };
}

export function renderTwoShapes(
  cells: boolean[][],
  style: TwoStyle,
  cellW: number,
  cellH: number,
  noGap: boolean,
  asset?: string,
): JSX.Element[] {
  const GAP = noGap ? 0 : Math.min(cellW, cellH) * 0.05;
  // When noGap, add a thin stroke so contiguous cells have visible borders
  const strokeProps = noGap
    ? { stroke: "currentColor", strokeWidth: 0.5, strokeOpacity: 0.2 }
    : {};
  const shapes: JSX.Element[] = [];

  cells.forEach((row, r) => {
    row.forEach((active, c) => {
      if (!active) return;
      const x = c * cellW;
      const y = r * cellH;
      const key = `${r}-${c}`;

      if (style === "circle") {
        shapes.push(
          <circle
            key={key}
            cx={x + cellW / 2}
            cy={y + cellH / 2}
            r={Math.min(cellW, cellH) / 2 - GAP}
            fill="currentColor"
            {...strokeProps}
          />,
        );
      } else if ((style === "image" || style === "svg") && asset) {
        shapes.push(
          <image
            key={key}
            href={asset}
            x={x + GAP}
            y={y + GAP}
            width={cellW - GAP * 2}
            height={cellH - GAP * 2}
            preserveAspectRatio="xMidYMid slice"
          />,
        );
      } else {
        shapes.push(
          <rect
            key={key}
            x={x + GAP}
            y={y + GAP}
            width={cellW - GAP * 2}
            height={cellH - GAP * 2}
            fill="currentColor"
            {...strokeProps}
          />,
        );
      }
    });
  });

  return shapes;
}

export function getSvgDimensions(design: SavedTwo, cellPx: number) {
  const { cellW, cellH } = getCellDimensions(design.style, cellPx);
  return { svgW: design.cols * cellW, svgH: design.rows * cellH };
}
