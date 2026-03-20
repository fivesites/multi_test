"use client";

import { useSavedAssets } from "@/app/hooks/useSavedAssets";
import { renderGlyphShapes, glyphDims } from "@/app/lib/multiUtils";
import type { SavedAsset } from "@/app/lib/multiUtils";

function LogoAsset({ asset, size }: { asset: SavedAsset; size: number }) {
  if (asset.uploadedAsset) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset.uploadedAsset}
        alt="Multi²"
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  const sc = size / Math.max(asset.cols ?? 1, asset.rows ?? 1);
  const { w: gW, h: gH } = glyphDims(
    asset.cols ?? 1,
    asset.rows ?? 1,
    asset.glyphStyle,
    sc,
  );
  const dx = (size - gW) / 2;
  const dy = (size - gH) / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ color: asset.colorA ?? "currentColor" }}
    >
      <g transform={`translate(${dx},${dy})`}>{renderGlyphShapes(asset, sc)}</g>
    </svg>
  );
}

export default function HomeFooter() {
  const { saved } = useSavedAssets();

  const logo =
    saved.find((a) => a.role === "LOGO_square") ??
    saved.find((a) => a.role === "LOGO_horizontal") ??
    saved.find((a) => a.role === "squared2");

  return (
    <footer className="h-screen  bg-background flex flex-col ">
      {/* ── Center: Logo ── */}
      <div className="flex-1 flex items-center justify-center p-8 ">
        {logo ? (
          <LogoAsset asset={logo} size={160} />
        ) : (
          <span className="font-rounded font-black text-4xl text-foreground">
            M²
          </span>
        )}
      </div>
    </footer>
  );
}
