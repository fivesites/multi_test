"use client";

import Link from "next/link";
import { useSavedAssets } from "@/app/hooks/useSavedAssets";
import { renderGlyphShapes, glyphDims } from "@/app/lib/multiUtils";
import type { SavedAsset } from "@/app/lib/multiUtils";

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

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
      <g transform={`translate(${dx},${dy})`}>
        {renderGlyphShapes(asset, sc)}
      </g>
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
    <footer className="h-screen lg:h-[50vh] bg-background border-t border-border flex flex-col lg:grid lg:grid-cols-3">
      {/* ── Mobile: nav links row at top ── */}
      <div className="flex lg:hidden items-center gap-0 border-b border-border shrink-0">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex-1 flex items-center justify-center h-12 font-rounded text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-r border-border last:border-r-0"
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* ── Desktop col 1: empty ── */}
      <div className="hidden lg:block" />

      {/* ── Center: Logo ── */}
      <div className="flex-1 lg:flex-none flex items-center justify-center p-8 border-x border-border">
        {logo ? (
          <LogoAsset asset={logo} size={160} />
        ) : (
          <span className="font-rounded font-black text-4xl text-foreground">
            M²
          </span>
        )}
      </div>

      {/* ── Desktop col 3: links ── */}
      <div className="hidden lg:flex flex-col items-start justify-center gap-2 p-8">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="font-rounded text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
