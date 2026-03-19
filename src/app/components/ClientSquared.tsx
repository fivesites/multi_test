"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import HeroText from "./HeroText";
import { useXHeightSync } from "@/app/hooks/useXHeightSync";
import InlineTwoGlyph from "./InlineTwoGlyph";
import { useSavedAssets } from "@/app/hooks/useSavedAssets";
import type { SavedTwo } from "@/app/lib/twoUtils";

interface Props {
  texts: string[];
  className?: string;
  currentIndex?: number;
}

export default function ClientSquared({ texts, className, currentIndex }: Props) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const xHeight    = useXHeightSync(measureRef);
  const { saved: allAssets } = useSavedAssets();
  const [twoIdx, setTwoIdx] = useState(0);

  // Prefer assets with role "squared2", fall back to all glyphs
  const squared2 = allAssets.filter((a) => a.role === "squared2");
  const glyphs = squared2.length > 0 ? squared2 : allAssets.filter((a) => a.type === "glyph");

  // Sync glyph to external currentIndex when provided
  useEffect(() => {
    if (currentIndex === undefined || glyphs.length === 0) return;
    setTwoIdx(currentIndex % (glyphs.length + 1));
  }, [currentIndex, glyphs.length]);

  const handleWordChange = useCallback(() => {
    if (glyphs.length === 0) return;
    setTwoIdx((i) => (i + 1) % (glyphs.length + 1));
  }, [glyphs.length]);

  // Map SavedAsset → SavedTwo for InlineTwoGlyph
  const rawAsset = glyphs.length > 0 && twoIdx > 0 ? glyphs[twoIdx - 1] : undefined;
  const customTwo: SavedTwo | undefined = rawAsset
    ? {
        id:    rawAsset.id,
        label: rawAsset.label,
        cells: rawAsset.cells,
        style: rawAsset.glyphStyle as SavedTwo["style"],
        noGap: rawAsset.noGap,
        cols:  rawAsset.cols,
        rows:  rawAsset.rows,
        asset: rawAsset.uploadedAsset,
      }
    : undefined;

  return (
    <>
      <span
        ref={measureRef}
        className="absolute invisible font-rounded font-black text-6xl lg:text-8xl"
        aria-hidden="true"
      >
        x
      </span>
      <div className="flex items-baseline justify-center pointer-events-none">
        <HeroText
          className={className}
          texts={texts}
          displayedText={currentIndex !== undefined ? (texts[currentIndex % texts.length] ?? "") : undefined}
          onWordChange={handleWordChange}
        />
        {xHeight !== null && (
          <span className="text-secondary-foreground">
            <InlineTwoGlyph xHeight={xHeight} custom={customTwo} />
          </span>
        )}
      </div>
    </>
  );
}
