"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  type GlyphStyle,
  type CheckerMode,
  type AssetMode,
  type SavedAsset,
  ASSET_SIZES,
  STRIP_SIZES,
  DEFAULT_TWO_CELLS,
  DEFAULT_M_CELLS,
  renderGlyphShapes,
  glyphDims,
  patternDims,
  patternTileDims,
  exportAssetSvg,
} from "@/app/lib/multiUtils";
import { getCellDimensions } from "@/app/lib/twoUtils";
import { useSavedAssets } from "@/app/hooks/useSavedAssets";

const ARTBOARD_PX = 480;
const MAX_PREVIEW = 128;

function svgToPng(svgStr: string, w: number, h: number, blur: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const img  = new window.Image(w, h);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.filter = `blur(${blur}px) contrast(60)`;
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Rem values that divide evenly into 480px
const CELL_SIZES = [
  { label: "1rem", px: 16 }, // 30×30
  { label: "2rem", px: 32 }, // 15×15
  { label: "3rem", px: 48 }, // 10×10
  { label: "6rem", px: 96 }, //  5×5
  { label: "15rem", px: 240 }, //  2×2
  { label: "30rem", px: 480 }, //  1×1
] as const;

const GLYPH_STYLES: { id: GlyphStyle; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "circle", label: "Circle" },
  { id: "stretch-h", label: "Wide" },
  { id: "stretch-v", label: "Tall" },
  { id: "image", label: "Image" },
  { id: "svg", label: "SVG" },
];

const ASSET_MODES: { id: AssetMode; label: string }[] = [
  { id: "glyph", label: "Glyph" },
  { id: "pattern", label: "Pattern" },
  { id: "strip-h", label: "Border H" },
  { id: "strip-v", label: "Border V" },
];

type PrefillId = "2" | "m" | "square";

function cellCount(px: number) {
  return Math.floor(ARTBOARD_PX / px);
}

function makeGrid(count: number, seed: boolean[][]): boolean[][] {
  return Array.from({ length: count }, (_, r) =>
    Array.from({ length: count }, (_, c) => seed[r]?.[c] ?? false),
  );
}

function invertHex(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `#${(255 - r).toString(16).padStart(2, "0")}${(255 - g).toString(16).padStart(2, "0")}${(255 - b).toString(16).padStart(2, "0")}`;
}

// ── UI primitives ─────────────────────────────────────────────────────────────

function Btn({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      onClick={onClick}
      className="font-rounded text-xs uppercase tracking-widest h-8 whitespace-nowrap"
    >
      {children}
    </Button>
  );
}

const Sep = () => <div className="w-px h-5 bg-border shrink-0" />;

function ToolSelect({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-8 font-rounded text-xs uppercase tracking-widest border-border px-3 min-w-[100px] focus:ring-0 focus:ring-offset-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="font-rounded text-xs uppercase tracking-widest">
        {children}
      </SelectContent>
    </Select>
  );
}

// ── Pattern SVG content (JSX) ─────────────────────────────────────────────────
function PatternContent({
  cells,
  glyphStyle,
  noGap,
  uploadedAsset,
  cols,
  rows,
  cellPx,
  colorA,
  colorB,
  mode,
}: {
  cells: boolean[][];
  glyphStyle: GlyphStyle;
  noGap: boolean;
  uploadedAsset?: string;
  cols: number;
  rows: number;
  cellPx: number;
  colorA: string;
  colorB: string;
  mode: CheckerMode;
}) {
  const shapes = renderGlyphShapes(
    { cells, glyphStyle, noGap, uploadedAsset },
    cellPx,
  );
  const { w: gW, h: gH } = glyphDims(cols, rows, glyphStyle, cellPx);
  const { tileW, tileH, offsets } = patternTileDims(mode, gW, gH);

  return (
    <>
      <defs>
        <pattern
          id="pg"
          x="0"
          y="0"
          width={tileW}
          height={tileH}
          patternUnits="userSpaceOnUse"
        >
          <rect width={tileW} height={tileH} fill={colorB} />
          {offsets.map(({ x, y }, i) => (
            <g
              key={i}
              style={{ color: colorA }}
              transform={`translate(${x},${y})`}
            >
              {shapes}
            </g>
          ))}
        </pattern>
      </defs>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MultiGenerator() {
  const [cellSizePx, setCellSizePx] = useState(32);
  const [cells, setCells] = useState<boolean[][]>(() =>
    Array.from({ length: cellCount(32) }, () => Array(cellCount(32)).fill(false)),
  );
  const [glyphStyle, setGlyphStyle] = useState<GlyphStyle>("square");
  const [noGap, setNoGap] = useState(true);
  const [uploadedAsset, setUploadedAsset] = useState<string | null>(null);

  const [assetMode, setAssetMode] = useState<AssetMode>("glyph");
  const [prefillId, setPrefillId] = useState<PrefillId | null>(null);
  const [colorA, setColorA] = useState("#000000");
  const [checkerStripCount, setCheckerStripCount] = useState(2);

  const [inkBleed, setInkBleed] = useState(0);
  const [brushSize, setBrushSize] = useState<1 | 2>(1);

  const paintingRef = useRef<boolean | null>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const svgInputRef = useRef<HTMLInputElement>(null);

  const { save } = useSavedAssets();

  const count = cellCount(cellSizePx);
  const colorB = invertHex(colorA);

  // Derived checker mode from asset mode
  const checkerMode: CheckerMode =
    assetMode === "pattern"
      ? "square"
      : assetMode === "strip-h"
        ? "strip-h"
        : assetMode === "strip-v"
          ? "strip-v"
          : "square";

  const isPattern = assetMode !== "glyph";
  const isStrip = assetMode === "strip-h" || assetMode === "strip-v";

  const changeCellSize = (px: number) => {
    setCellSizePx(px);
    setCells((prev) => makeGrid(cellCount(px), prev));
  };

  const prefill = (id: PrefillId, seed: boolean[][]) => {
    setPrefillId(id);
    setCells(makeGrid(count, seed));
  };

  const prefillSquare = () => {
    setPrefillId("square");
    setCells(
      Array.from({ length: count }, (_, r) =>
        Array.from({ length: count }, (_, c) => (r + c) % 2 === 0),
      ),
    );
  };

  const paintBrush = useCallback((r: number, c: number, val?: boolean) => {
    setCells((prev) => {
      const next = prev.map((row) => [...row]);
      const paintVal = val !== undefined ? val : !prev[r]?.[c];
      for (let dr = 0; dr < brushSize; dr++) {
        for (let dc = 0; dc < brushSize; dc++) {
          if (next[r + dr]?.[c + dc] !== undefined) {
            next[r + dr][c + dc] = paintVal;
          }
        }
      }
      return next;
    });
    setPrefillId(null);
  }, [brushSize]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedAsset(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSvgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setUploadedAsset(
        `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(text)))}`,
      );
    };
    reader.readAsText(file);
  };

  useEffect(
    () => () => {
      if (uploadedAsset?.startsWith("blob:"))
        URL.revokeObjectURL(uploadedAsset);
    },
    [uploadedAsset],
  );

  const handleSave = async () => {
    const baseName = prefillId ?? "asset";
    const suffix = assetMode !== "glyph" ? `-${assetMode}` : "";
    const label = `${baseName}${suffix}${inkBleed > 0 ? "-ink" : ""}.svg`;
    const draft: SavedAsset = {
      id: "_",
      label,
      type: isPattern ? assetMode : "glyph",
      cells,
      glyphStyle,
      noGap,
      cols: count,
      rows: count,
      uploadedAsset: uploadedAsset ?? undefined,
      colorA,
      colorB,
      ...(isPattern && { checkerStripCount }),
    };
    let bakedUpload = uploadedAsset ?? undefined;
    if (inkBleed > 0) {
      const svgStr = exportAssetSvg(draft, ARTBOARD_PX);
      bakedUpload = await svgToPng(svgStr, ARTBOARD_PX, ARTBOARD_PX, inkBleed * 2);
    }
    const base = { label, cells, glyphStyle, noGap, cols: count, rows: count, uploadedAsset: bakedUpload };
    if (isPattern) {
      save({ ...base, type: assetMode, colorA, colorB, checkerStripCount });
    } else {
      save({ ...base, type: "glyph" as const, colorA, colorB });
    }
  };

  const doExport = (sizePx: number) => {
    const draft: SavedAsset = {
      id: "_",
      label: "_",
      type: assetMode,
      cells,
      glyphStyle,
      noGap,
      cols: count,
      rows: count,
      uploadedAsset: uploadedAsset ?? undefined,
      ...(isPattern && { colorA, colorB, checkerStripCount }),
    };
    const str = exportAssetSvg(draft, sizePx);
    const blob = new Blob([str], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const baseName = prefillId ?? "asset";
    const suffix = assetMode !== "glyph" ? `-${assetMode}` : "";
    a.download = `${baseName}${suffix}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const needsUpload = glyphStyle === "image" || glyphStyle === "svg";

  // Pattern preview dims for left panel
  const pvCellPx = 16;
  const { w: pvGlyphW, h: pvGlyphH } = glyphDims(
    count,
    count,
    glyphStyle,
    pvCellPx,
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-x-3 px-4 border-b border-border bg-background"
        style={{ minHeight: 32 }}
      >
        {/* Brush size */}
        <div className="flex gap-1 py-1">
          <Btn active={brushSize === 1} onClick={() => setBrushSize(1)}>S</Btn>
          <Btn active={brushSize === 2} onClick={() => setBrushSize(2)}>L</Btn>
        </div>

        <Sep />

        {/* Prefills */}
        <div className="flex gap-1 py-1">
          <Btn
            active={prefillId === "2"}
            onClick={() => prefill("2", DEFAULT_TWO_CELLS)}
          >
            2
          </Btn>
          <Btn
            active={prefillId === "m"}
            onClick={() => prefill("m", DEFAULT_M_CELLS)}
          >
            M
          </Btn>
          <Btn active={prefillId === "square"} onClick={prefillSquare}>
            Square
          </Btn>
        </div>

        <Sep />

        {/* Grid size */}
        <div className="py-1">
          <ToolSelect
            value={String(cellSizePx)}
            onValueChange={(v) => changeCellSize(Number(v))}
          >
            {CELL_SIZES.map(({ label, px }) => (
              <SelectItem
                key={px}
                value={String(px)}
                className="font-rounded text-xs uppercase tracking-widest"
              >
                {label} &nbsp;
                <span className="text-muted-foreground">
                  {cellCount(px)}×{cellCount(px)}
                </span>
              </SelectItem>
            ))}
          </ToolSelect>
        </div>

        {/* Style */}
        <div className="py-1">
          <ToolSelect
            value={glyphStyle}
            onValueChange={(v) => setGlyphStyle(v as GlyphStyle)}
          >
            {GLYPH_STYLES.map(({ id, label }) => (
              <SelectItem
                key={id}
                value={id}
                className="font-rounded text-xs uppercase tracking-widest"
              >
                {label}
              </SelectItem>
            ))}
          </ToolSelect>
        </div>

        <Btn active={noGap} onClick={() => setNoGap((v) => !v)}>
          No Gap
        </Btn>

        {glyphStyle === "image" && (
          <>
            <input
              ref={imgInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Btn
              active={!!uploadedAsset}
              onClick={() => imgInputRef.current?.click()}
            >
              {uploadedAsset ? "Change Image" : "Upload Image"}
            </Btn>
          </>
        )}
        {glyphStyle === "svg" && (
          <>
            <input
              ref={svgInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              className="hidden"
              onChange={handleSvgUpload}
            />
            <Btn
              active={!!uploadedAsset}
              onClick={() => svgInputRef.current?.click()}
            >
              {uploadedAsset ? "Change SVG" : "Upload SVG"}
            </Btn>
          </>
        )}

        <Sep />

        {/* Asset mode */}
        <div className="py-1">
          <ToolSelect
            value={assetMode}
            onValueChange={(v) => setAssetMode(v as AssetMode)}
          >
            {ASSET_MODES.map(({ id, label }) => (
              <SelectItem
                key={id}
                value={id}
                className="font-rounded text-xs uppercase tracking-widest"
              >
                {label}
              </SelectItem>
            ))}
          </ToolSelect>
        </div>

        {/* Strip size buttons (when strip mode) */}
        {isStrip && (
          <div className="flex gap-1 py-1">
            {STRIP_SIZES.map(({ label, count: c }) => (
              <Btn
                key={label}
                active={checkerStripCount === c}
                onClick={() => setCheckerStripCount(c)}
              >
                {label}
              </Btn>
            ))}
          </div>
        )}

        {/* Color A picker — all modes */}
        {(
          <label className="flex items-center gap-2 font-rounded text-xs text-muted-foreground py-1">
            Color
            <input
              type="color"
              value={colorA}
              onChange={(e) => setColorA(e.target.value)}
              className="w-6 h-6 cursor-pointer border border-border"
            />
          </label>
        )}

        <Sep />

        {/* Ink Bleed */}
        <div className="flex items-center gap-2 py-1">
          <span className="font-rounded text-xs uppercase tracking-widest text-muted-foreground whitespace-nowrap">Ink</span>
          <Slider
            min={0}
            max={20}
            step={1}
            value={[inkBleed]}
            onValueChange={([v]) => setInkBleed(v)}
            className="w-24"
          />
          <span className="font-mono text-xs text-muted-foreground w-4 text-right">{inkBleed}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-1 py-1 ml-auto">
          <Btn
            onClick={() =>
              setCells(
                Array.from({ length: count }, () => Array(count).fill(false)),
              )
            }
          >
            Clear
          </Btn>
          {isStrip ? (
            <Btn onClick={() => doExport(1440)}>Export</Btn>
          ) : (
            <div className="relative group">
              <Btn onClick={() => doExport(256)}>Export</Btn>
              <div className="absolute top-full right-0 z-10 hidden group-hover:flex flex-col bg-background border border-border shadow-md">
                {ASSET_SIZES.map(({ label, px }) => (
                  <button
                    key={label}
                    onClick={() => doExport(px)}
                    className="font-rounded text-xs px-3 h-8 text-left text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
                  >
                    {label} — {px}px
                  </button>
                ))}
              </div>
            </div>
          )}
          <Btn active onClick={handleSave}>
            Save
          </Btn>
        </div>
      </div>

      {/* ── Artboard + Preview ───────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 divide-x divide-border overflow-hidden">
        {/* Left — 480px artboard ────────────────────────────────────────────── */}
        <div className="w-1/2 overflow-auto flex items-start justify-start p-6">
          {/* Overflow-hidden wrapper clips ink bleed at artboard boundary */}
          <div
            className="border border-border shrink-0 overflow-hidden"
            style={{ width: ARTBOARD_PX, height: ARTBOARD_PX }}
          >
          <div
            className="relative select-none cursor-crosshair"
            style={{
              width: ARTBOARD_PX,
              height: ARTBOARD_PX,
              filter: inkBleed > 0 ? `blur(${inkBleed * 2}px) contrast(60)` : undefined,
            }}
            onMouseLeave={() => {
              paintingRef.current = null;
            }}
            onMouseUp={() => {
              paintingRef.current = null;
            }}
          >
            {needsUpload && !uploadedAsset && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/60 pointer-events-none z-10">
                <span className="font-rounded text-xs text-muted-foreground">
                  Upload a file first
                </span>
              </div>
            )}
            {cells.map((row, r) => (
              <div key={r} className="flex">
                {row.map((active, c) => (
                  <div
                    key={c}
                    style={{ width: cellSizePx, height: cellSizePx }}
                    className={`border border-border/20 transition-colors ${
                      active ? "bg-foreground" : "bg-background hover:bg-muted"
                    }`}
                    onMouseDown={() => {
                      const v = !active;
                      paintingRef.current = v;
                      paintBrush(r, c, v);
                    }}
                    onMouseEnter={() => {
                      if (paintingRef.current !== null)
                        paintBrush(r, c, paintingRef.current);
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          </div>{/* /overflow-hidden wrapper */}
        </div>

        {/* Right — size preview ─────────────────────────────────────────────── */}
        <div className="w-1/2 overflow-auto p-6 flex flex-col gap-4">
          <span className="font-rounded text-xs text-muted-foreground uppercase tracking-widest">
            {isStrip ? "Border sizes" : isPattern ? "Pattern sizes" : "Sizes"}
          </span>

          {isStrip ? (
            /* Strip pattern size ladder */
            <div className="flex flex-col gap-4">
              {STRIP_SIZES.map(({ label, count: c }) => {
                const dims = patternDims(checkerMode, pvGlyphW, pvGlyphH, c, 0);
                const DISP_W = 320;
                const dw =
                  checkerMode === "strip-h" ? DISP_W : Math.min(dims.w, DISP_W);
                const dh =
                  checkerMode === "strip-h"
                    ? Math.max(8, Math.round(dims.h * (DISP_W / dims.w)))
                    : Math.min(80, dims.h);
                const svgW = checkerMode === "strip-h" ? 1440 : dims.w;
                const svgH = checkerMode === "strip-h" ? dims.h : 1440;
                return (
                  <div key={label} className="flex items-center gap-4">
                    <span className="font-mono text-xs text-muted-foreground w-6 shrink-0">
                      {label}
                    </span>
                    <div
                      className="border border-border overflow-hidden"
                      style={{ width: dw, height: dh }}
                    >
                      <svg
                        width={svgW}
                        height={svgH}
                        viewBox={`0 0 ${svgW} ${svgH}`}
                        style={{ width: dw, height: dh }}
                      >
                        <PatternContent
                          cells={cells}
                          glyphStyle={glyphStyle}
                          noGap={noGap}
                          uploadedAsset={uploadedAsset ?? undefined}
                          cols={count}
                          rows={count}
                          cellPx={pvCellPx}
                          colorA={colorA}
                          colorB={colorB}
                          mode={checkerMode}
                        />
                        <rect width={svgW} height={svgH} fill="url(#pg)" />
                      </svg>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {dims.w}×{dims.h}px · {c}{" "}
                      {checkerMode === "strip-h" ? "rows" : "cols"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : isPattern ? (
            /* Square pattern size ladder */
            <div className="flex flex-wrap gap-4 items-end">
              {ASSET_SIZES.map(({ label, px }) => {
                const d = Math.min(px, MAX_PREVIEW);
                const cpx = d / count;
                const { w: gW, h: gH } = glyphDims(
                  count,
                  count,
                  glyphStyle,
                  cpx,
                );
                patternTileDims(checkerMode, gW, gH);
                return (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div
                      style={{ width: d, height: d }}
                      className="border border-border overflow-hidden"
                    >
                      <div style={{ filter: inkBleed > 0 ? `blur(${inkBleed * 2}px) contrast(60)` : undefined }}>
                      <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`}>
                        <PatternContent
                          cells={cells}
                          glyphStyle={glyphStyle}
                          noGap={noGap}
                          uploadedAsset={uploadedAsset ?? undefined}
                          cols={count}
                          rows={count}
                          cellPx={cpx}
                          colorA={colorA}
                          colorB={colorB}
                          mode={checkerMode}
                        />
                        <rect width={d} height={d} fill="url(#pg)" />
                        <title>{label}</title>
                      </svg>
                      </div>{/* /filter */}
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {label}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground/60">
                      {px}px
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Plain glyph size ladder */
            <div className="flex flex-wrap gap-4 items-end">
              {ASSET_SIZES.map(({ label, px }) => {
                const scaledCell = Math.min(px, MAX_PREVIEW) / count;
                const { cellW, cellH } = getCellDimensions(
                  glyphStyle,
                  scaledCell,
                );
                const svgW = count * cellW;
                const svgH = count * cellH;
                return (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div
                      style={{ width: svgW, height: svgH, overflow: "hidden" }}
                      className="border border-border"
                    >
                      <div style={{ filter: inkBleed > 0 ? `blur(${inkBleed * 2}px) contrast(60)` : undefined }}>
                      <svg
                        width={svgW}
                        height={svgH}
                        viewBox={`0 0 ${svgW} ${svgH}`}
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-foreground"
                      >
                        {renderGlyphShapes(
                          {
                            cells,
                            glyphStyle,
                            noGap,
                            uploadedAsset: uploadedAsset ?? undefined,
                          },
                          scaledCell,
                        )}
                      </svg>
                      </div>{/* /filter */}
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {label}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground/60">
                      {px}px
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
