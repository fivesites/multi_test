"use client";

import { useState, useRef, useCallback, useId } from "react";
import { useSavedAssets } from "@/app/hooks/useSavedAssets";
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

const AW = 480;

const FORMATS = [
  { label: "1:1",  ratioW: 1,  ratioH: 1,  exportW: 1080, exportH: 1080 },
  { label: "16:9", ratioW: 16, ratioH: 9,  exportW: 1920, exportH: 1080 },
  { label: "9:16", ratioW: 9,  ratioH: 16, exportW: 1080, exportH: 1920 },
  { label: "4:5",  ratioW: 4,  ratioH: 5,  exportW: 1080, exportH: 1350 },
] as const;

const TILE_SIZES = [
  { label: "2rem",  px: 32  },
  { label: "3rem",  px: 48  },
  { label: "6rem",  px: 96  },
  { label: "15rem", px: 240 },
] as const;

const PALETTE = [
  "#000000", "#1a1a1a", "#333333", "#666666",
  "#999999", "#cccccc", "#e8e8e8", "#ffffff",
  "#e8d5c4", "#c9a87c", "#a67c52", "#6b4c2a",
  "#c4d5e8", "#7ca8c9", "#3a7cb8", "#1a3a6b",
];

type FormatLabel = (typeof FORMATS)[number]["label"];
// Each cell holds a stack of asset IDs (bottom → top)
type CompGrid = string[][][];

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Per-cell asset renderer ───────────────────────────────────────────────────

function AssetLayer({ asset, tilePx }: { asset: SavedAsset; tilePx: number }) {
  const uid = useId();

  if (asset.type !== "glyph") {
    // Render pattern/border tiling within the tile
    // Choose cellPx so pattern repeats ~2× across the tile
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

  // Glyph: centered in tile
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

// ── Main component ────────────────────────────────────────────────────────────

export default function MultiComposer() {
  const { saved, save } = useSavedAssets();

  const [formatLabel, setFormatLabel] = useState<FormatLabel>("1:1");
  const [tilePx, setTilePx]           = useState(96);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [bgColor, setBgColor]         = useState("#ffffff");

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

  // ── Painting — layered, latest on top ────────────────────────────────────

  const paintCell = useCallback((r: number, c: number, erase: boolean) => {
    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => [...cell]));
      const cell = next[r]?.[c];
      if (!cell) return prev;
      if (erase) {
        cell.pop(); // remove topmost layer
      } else if (selectedId) {
        cell.push(selectedId); // add on top
      }
      return next;
    });
  }, [selectedId]);

  const cellFromPointer = (e: React.PointerEvent): [number, number] | null => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const c = Math.floor((e.clientX - rect.left) / tilePx);
    const r = Math.floor((e.clientY - rect.top)  / tilePx);
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    return [r, c];
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.button !== 2) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isPainting.current = true;
    erasing.current    = e.button === 2 || e.shiftKey;
    const cell = cellFromPointer(e);
    if (cell) paintCell(cell[0], cell[1], erasing.current);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPainting.current) return;
    const cell = cellFromPointer(e);
    if (cell) paintCell(cell[0], cell[1], erasing.current);
  };

  const onPointerUp = () => { isPainting.current = false; };

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
          const encoded = encodeURIComponent(exportAssetSvg(asset, eTile));
          const x = c * eTile, y = r * eTile;
          pieces += `<image x="${x}" y="${y}" width="${eTile}" height="${eTile}" preserveAspectRatio="xMidYMid meet" href="data:image/svg+xml,${encoded}"/>`;
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
    const svg      = buildSvg();
    const dataUrl  = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    await save({
      label:         `comp-${formatLabel}`,
      type:          "composition",
      cells:         [],
      glyphStyle:    "square",
      noGap:         true,
      cols:          cols,
      rows:          rows,
      uploadedAsset: dataUrl,
      colorB:        bgColor,
    });
  };

  // ── UI ────────────────────────────────────────────────────────────────────

  const Btn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      style={{ height: 28 }}
      className="px-2 font-rounded text-xs uppercase tracking-widest border border-border hover:bg-muted transition-colors"
    >
      {children}
    </button>
  );

  const selectedAsset = saved.find((a) => a.id === selectedId);

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

        <label className="flex items-center gap-1.5 font-rounded text-xs text-muted-foreground">
          BG
          <div className="flex items-center gap-0.5">
            {PALETTE.map((hex) => (
              <button
                key={hex}
                onClick={() => setBgColor(hex)}
                title={hex}
                style={{
                  width: 14, height: 14,
                  background: hex,
                  border: bgColor === hex ? "2px solid var(--foreground)" : "1px solid var(--border)",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-5 h-5 cursor-pointer border border-border"
          />
        </label>

        <div className="w-px h-5 bg-border" />

        {selectedAsset && (
          <span className="font-mono text-xs text-muted-foreground">{selectedAsset.label}</span>
        )}

        <div className="flex-1" />
        <Btn onClick={() => setGrid(makeGrid(rows, cols))}>Clear</Btn>
        <Btn onClick={handleExport}>Export</Btn>
        <Btn onClick={handleSave}>Save</Btn>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1">
        {/* Asset palette */}
        <div
          className="border-r border-border overflow-y-auto shrink-0 flex flex-col"
          style={{ width: 56 }}
        >
          {saved.length === 0 && (
            <p className="p-2 font-mono text-[9px] text-muted-foreground leading-tight">No assets</p>
          )}
          {saved.map((asset) => {
            const tp = 40;
            const sc = tp / Math.max(asset.cols, asset.rows);
            const { w: gW, h: gH } = glyphDims(asset.cols, asset.rows, asset.glyphStyle, sc);
            const dx = (tp - gW) / 2;
            const dy = (tp - gH) / 2;
            const isActive = selectedId === asset.id;
            return (
              <button
                key={asset.id}
                onClick={() => setSelectedId((p) => p === asset.id ? null : asset.id)}
                className={`shrink-0 flex items-center justify-center border-b border-border transition-colors ${
                  isActive ? "bg-foreground" : "hover:bg-muted"
                }`}
                style={{ width: 56, height: 56 }}
                title={asset.label}
              >
                <svg
                  width={tp} height={tp}
                  viewBox={`0 0 ${tp} ${tp}`}
                  style={{ color: isActive ? (asset.colorB ?? "#ffffff") : (asset.colorA ?? "#000000") }}
                >
                  <g transform={`translate(${dx},${dy})`}>
                    {renderGlyphShapes(asset, sc)}
                  </g>
                </svg>
              </button>
            );
          })}
        </div>

        {/* Canvas */}
        <div
          className="flex-1 overflow-auto flex items-start justify-center p-8"
          style={{ background: "hsl(var(--muted) / 0.3)" }}
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
              cursor:      selectedId ? "crosshair" : "default",
              userSelect:  "none",
              touchAction: "none",
              boxShadow:   "0 2px 16px rgba(0,0,0,0.12)",
            }}
          >
            {Array.from({ length: rows }, (_, r) =>
              Array.from({ length: cols }, (_, c) => {
                const stack = grid[r]?.[c] ?? [];
                return (
                  <div
                    key={`${r}-${c}`}
                    style={{
                      width: tilePx, height: tilePx,
                      position: "relative",
                      outline: "0.5px solid rgba(128,128,128,0.12)",
                    }}
                  >
                    {stack.map((assetId, i) => {
                      const asset = saved.find((a) => a.id === assetId);
                      return asset ? <AssetLayer key={`${assetId}-${i}`} asset={asset} tilePx={tilePx} /> : null;
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
