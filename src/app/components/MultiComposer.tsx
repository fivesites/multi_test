"use client";

import { useState, useRef, useCallback, useId, useEffect } from "react";
import { useSavedAssets } from "@/app/hooks/useSavedAssets";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  renderGlyphShapes,
  glyphDims,
  patternTileDims,
  exportAssetSvg,
  type SavedAsset,
} from "@/app/lib/multiUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Constants ─────────────────────────────────────────────────────────────────

const AW = 720;
const SIDEBAR_RECENT = 8;

const FORMATS = [
  { label: "1:1",  ratioW: 1,  ratioH: 1,  exportW: 1080, exportH: 1080 },
  { label: "16:9", ratioW: 16, ratioH: 9,  exportW: 1920, exportH: 1080 },
  { label: "9:16", ratioW: 9,  ratioH: 16, exportW: 1080, exportH: 1920 },
  { label: "4:5",  ratioW: 4,  ratioH: 5,  exportW: 1080, exportH: 1350 },
] as const;

const TILE_SIZES = [
  { label: "1rem",  px: 16  },
  { label: "2rem",  px: 32  },
  { label: "3rem",  px: 48  },
  { label: "6rem",  px: 96  },
  { label: "15rem", px: 240 },
] as const;

const THEME_VARS = [
  "--background",
  "--foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
];

type FormatLabel = (typeof FORMATS)[number]["label"];
type CompGrid = string[][][];
type CellTransform = { rotate: number; scale: number };

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveColor(varName: string): string {
  const el = document.createElement("div");
  el.style.color = `var(${varName})`;
  document.body.appendChild(el);
  const rgb = getComputedStyle(el).color;
  document.body.removeChild(el);
  const m = rgb.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!m) return "#000000";
  return "#" + [m[1], m[2], m[3]].map((n) => parseInt(n).toString(16).padStart(2, "0")).join("");
}

function getGridDims(ratioW: number, ratioH: number, tilePx: number) {
  const nomH = Math.round(AW * ratioH / ratioW);
  return {
    cols: Math.floor(AW   / tilePx),
    rows: Math.floor(nomH / tilePx),
  };
}

function makeGrid(rows: number, cols: number): CompGrid {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => []));
}

function resizeGrid(prev: CompGrid, nr: number, nc: number): CompGrid {
  return Array.from({ length: nr }, (_, r) =>
    Array.from({ length: nc }, (_, c) => prev[r]?.[c] ?? []),
  );
}

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
      ctx.filter = `blur(${blur}px) contrast(20)`;
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
}

// ── Per-cell asset renderer ───────────────────────────────────────────────────

function AssetLayer({ asset, tilePx }: { asset: SavedAsset; tilePx: number }) {
  const uid = useId();

  if (asset.type !== "glyph") {
    const patCellPx = tilePx / Math.max(asset.cols, asset.rows) / 2;
    const { w: gW, h: gH } = glyphDims(asset.cols, asset.rows, asset.glyphStyle, patCellPx);
    const { tileW, tileH, offsets } = patternTileDims("square", gW, gH);
    const colorA = asset.colorA ?? "#000000";
    const colorB = asset.colorB ?? "#ffffff";
    const patId  = `pat-${uid}`;
    return (
      <svg
        width={tilePx} height={tilePx}
        viewBox={`0 0 ${tilePx} ${tilePx}`}
        style={{ display: "block", position: "absolute", inset: 0 }}
        className="pointer-events-none"
      >
        <defs>
          <pattern id={patId} x="0" y="0" width={tileW} height={tileH} patternUnits="userSpaceOnUse">
            <rect width={tileW} height={tileH} fill={colorB} />
            {offsets.map(({ x, y }, i) => (
              <g key={i} style={{ color: colorA }} transform={`translate(${x},${y})`}>
                {renderGlyphShapes(asset, patCellPx)}
              </g>
            ))}
          </pattern>
        </defs>
        <rect width={tilePx} height={tilePx} fill={`url(#${patId})`} />
      </svg>
    );
  }

  const scaledCell = tilePx / Math.max(asset.cols, asset.rows);
  const { w: gW, h: gH } = glyphDims(asset.cols, asset.rows, asset.glyphStyle, scaledCell);
  const dx = (tilePx - gW) / 2;
  const dy = (tilePx - gH) / 2;
  return (
    <svg
      width={tilePx} height={tilePx}
      viewBox={`0 0 ${tilePx} ${tilePx}`}
      style={{ color: asset.colorA ?? "#000000", display: "block", position: "absolute", inset: 0 }}
      className="pointer-events-none"
    >
      <g transform={`translate(${dx},${dy})`}>
        {renderGlyphShapes(asset, scaledCell)}
      </g>
    </svg>
  );
}

// ── Asset thumbnail ───────────────────────────────────────────────────────────

function AssetThumb({
  asset,
  size = 40,
  active = false,
}: {
  asset: SavedAsset;
  size?: number;
  active?: boolean;
}) {
  const sc = size / Math.max(asset.cols, asset.rows);
  const { w: gW, h: gH } = glyphDims(asset.cols, asset.rows, asset.glyphStyle, sc);
  const dx = (size - gW) / 2;
  const dy = (size - gH) / 2;
  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ color: active ? (asset.colorB ?? "#ffffff") : (asset.colorA ?? "#000000") }}
    >
      <g transform={`translate(${dx},${dy})`}>
        {renderGlyphShapes(asset, sc)}
      </g>
    </svg>
  );
}


// ── Main component ────────────────────────────────────────────────────────────

export default function MultiComposer() {
  const { saved, save } = useSavedAssets();

  const [formatLabel, setFormatLabel] = useState<FormatLabel>("1:1");
  const [tilePx, setTilePx]           = useState(96);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [bgColor, setBgColor]         = useState("#ffffff");
  const [inkBleed, setInkBleed]       = useState(0);
  const [brushSize, setBrushSize]     = useState<1 | 2>(1);

  // Transform mode
  const [mode, setMode]                   = useState<"paint" | "select">("paint");
  const [selectedCell, setSelectedCell]   = useState<string | null>(null);
  const [cellTransforms, setCellTransforms] = useState<Record<string, CellTransform>>({});

  // Theme color swatches
  const [themeSwatches, setThemeSwatches] = useState<string[]>([]);
  useEffect(() => {
    setThemeSwatches(THEME_VARS.map(resolveColor));
  }, []);

  const format = FORMATS.find((f) => f.label === formatLabel)!;
  const { cols, rows } = getGridDims(format.ratioW, format.ratioH, tilePx);
  const canvasW = cols * tilePx;
  const canvasH = rows * tilePx;

  const [grid, setGrid] = useState<CompGrid>(() => makeGrid(rows, cols));

  const isPainting = useRef(false);
  const erasing    = useRef(false);
  const canvasRef  = useRef<HTMLDivElement>(null);

  // ── Reshape ───────────────────────────────────────────────────────────────

  const changeFormat = (label: FormatLabel) => {
    const fmt = FORMATS.find((f) => f.label === label)!;
    const { cols: nc, rows: nr } = getGridDims(fmt.ratioW, fmt.ratioH, tilePx);
    setFormatLabel(label);
    setGrid((prev) => resizeGrid(prev, nr, nc));
  };

  const changeTile = (px: number) => {
    const { cols: nc, rows: nr } = getGridDims(format.ratioW, format.ratioH, px);
    setTilePx(px);
    setGrid((prev) => resizeGrid(prev, nr, nc));
  };

  // ── Painting ──────────────────────────────────────────────────────────────

  const paintAt = useCallback((baseR: number, baseC: number, erase: boolean) => {
    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => [...cell]));
      for (let dr = 0; dr < brushSize; dr++) {
        for (let dc = 0; dc < brushSize; dc++) {
          const cell = next[baseR + dr]?.[baseC + dc];
          if (!cell) continue;
          if (erase) {
            cell.pop();
          } else if (selectedId) {
            cell.push(selectedId);
          }
        }
      }
      return next;
    });
  }, [selectedId, brushSize]);

  const cellFromPointer = (e: React.PointerEvent): [number, number] | null => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const c = Math.floor((e.clientX - rect.left) / tilePx);
    const r = Math.floor((e.clientY - rect.top)  / tilePx);
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    return [r, c];
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (mode === "select") {
      const cell = cellFromPointer(e);
      if (cell) {
        const key = `${cell[0]}-${cell[1]}`;
        setSelectedCell((prev) => prev === key ? null : key);
      }
      return;
    }
    if (e.button !== 0 && e.button !== 2) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isPainting.current = true;
    erasing.current    = e.button === 2 || e.shiftKey;
    const cell = cellFromPointer(e);
    if (cell) paintAt(cell[0], cell[1], erasing.current);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPainting.current) return;
    const cell = cellFromPointer(e);
    if (cell) paintAt(cell[0], cell[1], erasing.current);
  };

  const onPointerUp = () => { isPainting.current = false; };

  // ── Cell transform helpers ─────────────────────────────────────────────────

  const getTransform = (key: string): CellTransform =>
    cellTransforms[key] ?? { rotate: 0, scale: 1 };

  const setTransform = (key: string, patch: Partial<CellTransform>) => {
    setCellTransforms((prev) => ({
      ...prev,
      [key]: { ...getTransform(key), ...patch },
    }));
  };

  const selTransform = selectedCell ? getTransform(selectedCell) : null;

  // ── SVG builder ───────────────────────────────────────────────────────────

  const buildSvg = () => {
    const scale = format.exportW / canvasW;
    const eTile = tilePx * scale;
    const eW    = format.exportW;
    const eH    = rows * eTile;
    let pieces = "";
    grid.forEach((row, r) => {
      row.forEach((stack, c) => {
        stack.forEach((assetId) => {
          const asset = saved.find((a) => a.id === assetId);
          if (!asset) return;
          const t = cellTransforms[`${r}-${c}`];
          const cx = c * eTile + eTile / 2;
          const cy = r * eTile + eTile / 2;
          const encoded = encodeURIComponent(exportAssetSvg(asset, eTile));
          const transform = t
            ? `rotate(${t.rotate}, ${cx}, ${cy}) scale(${t.scale})`
            : "";
          const x = c * eTile, y = r * eTile;
          pieces += `<image x="${x}" y="${y}" width="${eTile}" height="${eTile}" preserveAspectRatio="xMidYMid meet"${transform ? ` transform="${transform}"` : ""} href="data:image/svg+xml,${encoded}"/>`;
        });
      });
    });
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" width="${eW}" height="${eH}" viewBox="0 0 ${eW} ${eH}">` +
      `<rect width="${eW}" height="${eH}" fill="${bgColor}"/>` +
      pieces + `</svg>`
    );
  };

  // ── Export / Save ─────────────────────────────────────────────────────────

  const handleExport = () => {
    const svg  = buildSvg();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `comp-${formatLabel.replace(":", "x")}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    const svg = buildSvg();
    let dataUrl: string;
    if (inkBleed > 0) {
      const scale = format.exportW / canvasW;
      const eH    = Math.round(rows * tilePx * scale);
      dataUrl = await svgToPng(svg, format.exportW, eH, inkBleed);
    } else {
      dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }
    await save({
      label:         `comp-${formatLabel}`,
      type:          "composition",
      cells:         [],
      glyphStyle:    "square",
      noGap:         true,
      cols,
      rows,
      uploadedAsset: dataUrl,
      colorB:        bgColor,
    });
  };

  // ── UI ────────────────────────────────────────────────────────────────────

  const selectedAsset = saved.find((a) => a.id === selectedId);
  const recentAssets  = saved.slice(-SIDEBAR_RECENT);

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-4 border-b border-border shrink-0 flex-wrap"
        style={{ minHeight: 40 }}
      >
        <Select value={formatLabel} onValueChange={(v) => changeFormat(v as FormatLabel)}>
          <SelectTrigger className="h-7 w-20 font-rounded text-xs uppercase tracking-widest">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FORMATS.map((f) => (
              <SelectItem key={f.label} value={f.label} className="font-rounded text-xs uppercase">
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(tilePx)} onValueChange={(v) => changeTile(Number(v))}>
          <SelectTrigger className="h-7 w-20 font-rounded text-xs uppercase tracking-widest">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TILE_SIZES.map((s) => (
              <SelectItem key={s.px} value={String(s.px)} className="font-rounded text-xs uppercase">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-px h-5 bg-border" />

        {/* BG color */}
        <label className="flex items-center gap-1.5 font-rounded text-xs text-muted-foreground">
          BG
          <div className="flex items-center gap-0.5">
            {themeSwatches.map((color, i) => (
              <button
                key={i}
                onClick={() => setBgColor(color)}
                title={color}
                style={{
                  width: 14, height: 14,
                  background: color,
                  border: bgColor === color ? "2px solid var(--foreground)" : "1px solid var(--border)",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-7 h-7 cursor-pointer border border-border rounded-none p-0"
          />
        </label>

        <div className="w-px h-5 bg-border" />

        {/* Mode toggle */}
        <Button
          size="sm"
          variant={mode === "select" ? "default" : "outline"}
          onClick={() => { setMode((m) => m === "paint" ? "select" : "paint"); setSelectedCell(null); }}
          className="font-rounded text-xs uppercase tracking-widest h-7 px-2"
          title="Transform mode"
        >
          ↻
        </Button>

        {/* Transform controls — only when in select mode with a cell selected */}
        {mode === "select" && selTransform && selectedCell && (
          <>
            <span className="font-rounded text-xs text-muted-foreground">Rot</span>
            <Slider
              min={0} max={360} step={5}
              value={[selTransform.rotate]}
              onValueChange={([v]) => setTransform(selectedCell, { rotate: v })}
              className="w-20"
            />
            <span className="font-mono text-xs text-muted-foreground w-8">{selTransform.rotate}°</span>

            <span className="font-rounded text-xs text-muted-foreground">Scale</span>
            <Slider
              min={25} max={200} step={5}
              value={[Math.round(selTransform.scale * 100)]}
              onValueChange={([v]) => setTransform(selectedCell, { scale: v / 100 })}
              className="w-20"
            />
            <span className="font-mono text-xs text-muted-foreground w-8">{Math.round(selTransform.scale * 100)}%</span>
          </>
        )}

        {mode === "paint" && (
          <>
            {/* Brush size */}
            <div className="flex items-center gap-1">
              <span className="font-rounded text-xs uppercase tracking-widest text-muted-foreground">Brush</span>
              <Button size="sm" variant={brushSize === 1 ? "default" : "outline"} onClick={() => setBrushSize(1)} className="font-rounded text-xs h-7 w-7 p-0">S</Button>
              <Button size="sm" variant={brushSize === 2 ? "default" : "outline"} onClick={() => setBrushSize(2)} className="font-rounded text-xs h-7 w-7 p-0">L</Button>
            </div>

            <div className="w-px h-5 bg-border" />

            {selectedAsset && (
              <span className="font-mono text-xs text-muted-foreground">{selectedAsset.label}</span>
            )}

            <div className="w-px h-5 bg-border" />

            {/* Ink Bleed */}
            <div className="flex items-center gap-2">
              <span className="font-rounded text-xs uppercase tracking-widest text-muted-foreground whitespace-nowrap">Ink</span>
              <Slider min={0} max={15} step={1} value={[inkBleed]} onValueChange={([v]) => setInkBleed(v)} className="w-24" />
              <span className="font-mono text-xs text-muted-foreground w-4 text-right">{inkBleed}</span>
            </div>
          </>
        )}

        <div className="flex-1" />
        <Button size="sm" variant="outline" onClick={() => setGrid(makeGrid(rows, cols))} className="font-rounded text-xs uppercase tracking-widest">Clear</Button>
        <Button size="sm" variant="outline" onClick={handleExport} className="font-rounded text-xs uppercase tracking-widest">Export</Button>
        <Button size="sm" variant="default" onClick={handleSave} className="font-rounded text-xs uppercase tracking-widest">Save</Button>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1">
        {/* Asset sidebar */}
        <div
          className="border-r border-border overflow-y-auto shrink-0 flex flex-col"
          style={{ width: 56 }}
        >
          {recentAssets.length === 0 && (
            <p className="p-2 font-mono text-[9px] text-muted-foreground leading-tight">No assets</p>
          )}
          {recentAssets.map((asset) => {
            const isActive = selectedId === asset.id;
            return (
              <button
                key={asset.id}
                onClick={() => { setSelectedId((p) => p === asset.id ? null : asset.id); setMode("paint"); }}
                className={`shrink-0 flex items-center justify-center border-b border-border transition-colors ${
                  isActive ? "bg-foreground" : "hover:bg-muted"
                }`}
                style={{ width: 56, height: 56 }}
                title={asset.label}
              >
                <AssetThumb asset={asset} size={40} active={isActive} />
              </button>
            );
          })}
        </div>

        {/* Canvas */}
        <div
          className="flex-1 overflow-auto flex items-center justify-center p-3"
          style={{ background: "hsl(var(--muted) / 0.3)" }}
        >
          <div
            style={{
              width: canvasW,
              height: canvasH,
              overflow: "hidden",
              boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
              flexShrink: 0,
            }}
          >
            <div
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                width:    canvasW,
                height:   canvasH,
                background: bgColor,
                display:  "grid",
                gridTemplateColumns: `repeat(${cols}, ${tilePx}px)`,
                gridTemplateRows:    `repeat(${rows}, ${tilePx}px)`,
                cursor:      mode === "select" ? "pointer" : (selectedId ? "crosshair" : "default"),
                userSelect:  "none",
                touchAction: "none",
                filter: inkBleed > 0 ? `blur(${inkBleed * 0.5}px) contrast(20)` : undefined,
              }}
            >
              {Array.from({ length: rows }, (_, r) =>
                Array.from({ length: cols }, (_, c) => {
                  const stack = grid[r]?.[c] ?? [];
                  const cellKey = `${r}-${c}`;
                  const t = cellTransforms[cellKey];
                  const isSelected = mode === "select" && selectedCell === cellKey;
                  return (
                    <div
                      key={cellKey}
                      style={{
                        width: tilePx, height: tilePx,
                        position: "relative",
                        outline: isSelected
                          ? "2px solid var(--primary)"
                          : "0.5px solid rgba(128,128,128,0.12)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          transform: t ? `rotate(${t.rotate}deg) scale(${t.scale})` : undefined,
                          transformOrigin: "center center",
                        }}
                      >
                        {stack.map((assetId, i) => {
                          const asset = saved.find((a) => a.id === assetId);
                          return asset ? <AssetLayer key={`${assetId}-${i}`} asset={asset} tilePx={tilePx} /> : null;
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
