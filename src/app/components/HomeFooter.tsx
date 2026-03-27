"use client";

import Link from "next/link";
import { useSavedAssets } from "@/app/hooks/useSavedAssets";
import { renderGlyphShapes, glyphDims } from "@/app/lib/multiUtils";
import type { SavedAsset } from "@/app/lib/multiUtils";

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
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
    <footer className="min-h-[25vh] bg-background flex flex-col items-center lg:items-start px-8 py-6 gap-6">
      {/* Logo */}
      <div className="flex items-center justify-center lg:justify-start">
        {logo ? (
          <LogoAsset asset={logo} size={48} />
        ) : (
          <span className="font-rounded font-black text-2xl text-foreground">
            M²
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
