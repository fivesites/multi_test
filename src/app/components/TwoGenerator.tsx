"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  type TwoStyle,
  getCellDimensions,
  renderTwoShapes,
  getSvgDimensions,
} from "@/app/lib/twoUtils";
import { useSavedTwos } from "@/app/hooks/useSavedTwos";

const DEFAULT_ROWS = 9;
const DEFAULT_COLS = 7;
const CELL_PX = 40;

const DEFAULT_CELLS: boolean[][] = [
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

const STYLES: { id: TwoStyle; label: string }[] = [
  { id: "square",    label: "Square"    },
  { id: "circle",    label: "Circle"    },
  { id: "stretch-h", label: "Wide"      },
  { id: "stretch-v", label: "Tall"      },
  { id: "image",     label: "Image"     },
  { id: "svg",       label: "SVG"       },
];

const GALLERY_CELL_PX = 8;

export default function TwoGenerator() {
  const [cells, setCells] = useState<boolean[][]>(DEFAULT_CELLS);
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [style, setStyle] = useState<TwoStyle>("square");
  const [noGap, setNoGap] = useState(false);
  const [cellAsset, setCellAsset] = useState<string | null>(null);

  const paintingRef = useRef<boolean | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const svgInputRef = useRef<HTMLInputElement>(null);

  const { saved, save, remove } = useSavedTwos();

  const toggleCell = useCallback((r: number, c: number, val?: boolean) => {
    setCells((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = val !== undefined ? val : !prev[r][c];
      return next;
    });
  }, []);

  const resize = (newRows: number, newCols: number) => {
    setCells((prev) =>
      Array.from({ length: newRows }, (_, r) =>
        Array.from({ length: newCols }, (_, c) => prev[r]?.[c] ?? false),
      ),
    );
    setRows(newRows);
    setCols(newCols);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCellAsset(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSvgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(text)))}`;
      setCellAsset(dataUrl);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    return () => {
      if (cellAsset?.startsWith("blob:")) URL.revokeObjectURL(cellAsset);
    };
  }, [cellAsset]);

  const handleSave = () => {
    save({
      label: `Design ${saved.length + 1}`,
      cells,
      style,
      noGap,
      cols,
      rows,
      asset: cellAsset ?? undefined,
    });
  };

  const exportSVG = () => {
    if (!svgRef.current) return;
    const str = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([str], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "multi2.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const { cellW, cellH } = getCellDimensions(style, CELL_PX);
  const svgW = cols * cellW;
  const svgH = rows * cellH;
  const needsAsset = style === "image" || style === "svg";
  const hasAsset = !!cellAsset;

  return (
    <div className="flex flex-col gap-12">
      {/* Controls row 1: styles + gap */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex flex-wrap gap-2">
          {STYLES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setStyle(id)}
              className={`font-rounded text-xs uppercase tracking-widest px-3 py-1 border transition-colors ${
                style === id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setNoGap((v) => !v)}
          className={`font-rounded text-xs uppercase tracking-widest px-3 py-1 border transition-colors ${
            noGap
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
          }`}
        >
          No Gap
        </button>
      </div>

      {/* Controls row 2: sliders + asset + actions */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 font-rounded text-xs text-muted-foreground">
          <span>Cols</span>
          <input
            type="range" min={3} max={16} value={cols}
            onChange={(e) => resize(rows, Number(e.target.value))}
            className="w-20 accent-foreground"
          />
          <span className="w-4 text-center">{cols}</span>
        </div>
        <div className="flex items-center gap-2 font-rounded text-xs text-muted-foreground">
          <span>Rows</span>
          <input
            type="range" min={3} max={16} value={rows}
            onChange={(e) => resize(Number(e.target.value), cols)}
            className="w-20 accent-foreground"
          />
          <span className="w-4 text-center">{rows}</span>
        </div>

        {style === "image" && (
          <>
            <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <button
              onClick={() => imgInputRef.current?.click()}
              className={`font-rounded text-xs uppercase tracking-widest px-3 py-1 border transition-colors ${
                hasAsset ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {hasAsset ? "Change Image" : "Upload Image"}
            </button>
          </>
        )}
        {style === "svg" && (
          <>
            <input ref={svgInputRef} type="file" accept=".svg,image/svg+xml" className="hidden" onChange={handleSvgUpload} />
            <button
              onClick={() => svgInputRef.current?.click()}
              className={`font-rounded text-xs uppercase tracking-widest px-3 py-1 border transition-colors ${
                hasAsset ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {hasAsset ? "Change SVG" : "Upload SVG"}
            </button>
          </>
        )}

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => { setCells(DEFAULT_CELLS); setRows(DEFAULT_ROWS); setCols(DEFAULT_COLS); }}
            className="font-rounded text-xs uppercase tracking-widest px-3 py-1 border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => setCells(Array.from({ length: rows }, () => Array(cols).fill(false)))}
            className="font-rounded text-xs uppercase tracking-widest px-3 py-1 border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
          <button
            onClick={exportSVG}
            className="font-rounded text-xs uppercase tracking-widest px-3 py-1 border border-border text-foreground hover:bg-muted transition-colors"
          >
            Export SVG
          </button>
          <button
            onClick={handleSave}
            className="font-rounded text-xs uppercase tracking-widest px-3 py-1 border border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Canvas + preview */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Interactive grid */}
        <div
          className="select-none cursor-crosshair border border-border inline-block"
          onMouseLeave={() => { paintingRef.current = null; }}
          onMouseUp={() => { paintingRef.current = null; }}
        >
          {cells.map((row, r) => (
            <div key={r} className="flex">
              {row.map((active, c) => (
                <div
                  key={c}
                  style={{ width: CELL_PX, height: CELL_PX }}
                  className={`border border-border/20 transition-colors ${
                    active ? "bg-foreground" : "bg-background hover:bg-muted"
                  }`}
                  onMouseDown={() => {
                    const val = !active;
                    paintingRef.current = val;
                    toggleCell(r, c, val);
                  }}
                  onMouseEnter={() => {
                    if (paintingRef.current !== null) toggleCell(r, c, paintingRef.current);
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Previews */}
        <div className="flex flex-col gap-4">
          <span className="font-rounded text-xs text-muted-foreground uppercase tracking-widest">Preview</span>
          {needsAsset && !hasAsset ? (
            <p className="font-rounded text-xs text-muted-foreground">Upload a file to preview this style.</p>
          ) : (
            <>
              <div className="border border-border p-6 bg-foreground text-background inline-block">
                <svg
                  ref={svgRef}
                  width={svgW} height={svgH}
                  viewBox={`0 0 ${svgW} ${svgH}`}
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  {renderTwoShapes(cells, style, cellW, cellH, noGap, cellAsset ?? undefined)}
                </svg>
              </div>
              <div className="border border-border p-6 bg-background text-foreground inline-block">
                <svg
                  width={svgW} height={svgH}
                  viewBox={`0 0 ${svgW} ${svgH}`}
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  {renderTwoShapes(cells, style, cellW, cellH, noGap, cellAsset ?? undefined)}
                </svg>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Saved gallery */}
      {saved.length > 0 && (
        <div className="flex flex-col gap-4">
          <span className="font-rounded text-xs text-muted-foreground uppercase tracking-widest border-t border-border pt-6">
            Saved — {saved.length} design{saved.length !== 1 ? "s" : ""}
          </span>
          <div className="flex flex-wrap gap-4">
            {saved.map((design) => {
              const { cellW: gCW, cellH: gCH } = getCellDimensions(design.style, GALLERY_CELL_PX);
              const { svgW: gW, svgH: gH } = getSvgDimensions(design, GALLERY_CELL_PX);
              return (
                <div key={design.id} className="flex flex-col gap-2 items-start">
                  <div className="border border-border p-3 bg-foreground text-background">
                    <svg width={gW} height={gH} viewBox={`0 0 ${gW} ${gH}`} xmlns="http://www.w3.org/2000/svg">
                      {renderTwoShapes(design.cells, design.style, gCW, gCH, design.noGap, design.asset)}
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-rounded text-xs text-muted-foreground">{design.label}</span>
                    <button
                      onClick={() => remove(design.id)}
                      className="font-rounded text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
