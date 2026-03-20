"use client";

import { useSavedAssets } from "@/app/hooks/useSavedAssets";
import { renderGlyphShapes, glyphDims, type SavedAsset } from "@/app/lib/multiUtils";

function AssetPreview({ asset, size = 120 }: { asset: SavedAsset; size?: number }) {
  const cellPx = size / Math.max(asset.cols, asset.rows);
  const { w: gW, h: gH } = glyphDims(asset.cols, asset.rows, asset.glyphStyle, cellPx);
  const dx = (size - gW) / 2;
  const dy = (size - gH) / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ color: asset.colorA ?? "currentColor" }}
    >
      <g transform={`translate(${dx},${dy})`}>
        {renderGlyphShapes(asset, cellPx)}
      </g>
    </svg>
  );
}

export default function BrandAssets() {
  const { saved } = useSavedAssets();

  const logos = saved.filter((a) => a.role === "logo");
  const squared2s = saved.filter((a) => a.role === "squared_2" || a.role === "squared2");

  if (logos.length === 0 && squared2s.length === 0) return null;

  return (
    <>
      {logos.length > 0 && (
        <section className="mb-20">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8 border-b border-border pb-2">
            Logo
          </h2>
          <div className="flex flex-wrap gap-8 items-end">
            {logos.map((asset) => (
              <div key={asset.id} className="flex flex-col gap-2">
                <AssetPreview asset={asset} size={160} />
                <span className="font-mono text-xs text-muted-foreground">{asset.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {squared2s.length > 0 && (
        <section className="mb-20">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8 border-b border-border pb-2">
            2
          </h2>
          <div className="flex flex-wrap gap-6 items-end">
            {squared2s.map((asset) => (
              <div key={asset.id} className="flex flex-col gap-2 items-center">
                <AssetPreview asset={asset} size={80} />
                <span className="font-mono text-[10px] text-muted-foreground">{asset.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
