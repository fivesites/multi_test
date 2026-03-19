"use client";

import { useRef, useState, useEffect } from "react";
import { useXHeightSync } from "@/app/hooks/useXHeightSync";
import InlineTwoGlyph from "./InlineTwoGlyph";
import { useSavedAssets } from "@/app/hooks/useSavedAssets";
import type { SavedTwo } from "@/app/lib/twoUtils";

const STEPS = ["M", "Mu", "Mul", "Mult", "Multi"];
const FRAME_MS = 110;
const PAUSE_FULL_MS = 800;
const PAUSE_SHORT_MS = 350;

interface Props {
  className?: string;
  currentIndex?: number;
  paused?: boolean;
}

export default function MultiText({ className, currentIndex, paused }: Props) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const xHeight = useXHeightSync(measureRef);
  const { saved: allAssets } = useSavedAssets();
  const [twoIdx, setTwoIdx] = useState(0);

  // Typing animation
  const [textStep, setTextStep] = useState(0);
  const [forward, setForward] = useState(true);

  const glyphs = allAssets.filter((a) => a.type === "glyph");

  // Sync glyph index from parent carousel — freeze when paused
  useEffect(() => {
    if (paused) return;
    if (currentIndex === undefined || glyphs.length === 0) return;
    setTwoIdx(currentIndex % (glyphs.length + 1));
  }, [currentIndex, glyphs.length, paused]);

  // Typing animation loop — runs always
  useEffect(() => {
    let delay: number;
    if (forward && textStep === STEPS.length - 1) {
      delay = PAUSE_FULL_MS;
    } else if (!forward && textStep === 0) {
      delay = PAUSE_SHORT_MS;
    } else {
      delay = FRAME_MS;
    }

    const id = setTimeout(() => {
      if (forward) {
        if (textStep === STEPS.length - 1) {
          setForward(false);
          setTextStep(STEPS.length - 2);
          if (glyphs.length > 0) setTwoIdx((i) => (i + 1) % (glyphs.length + 1));
        } else {
          setTextStep((s) => s + 1);
        }
      } else {
        if (textStep === 0) {
          setForward(true);
          setTextStep(1);
        } else {
          setTextStep((s) => s - 1);
        }
      }
    }, delay);

    return () => clearTimeout(id);
  }, [textStep, forward, glyphs.length]);

  const rawAsset =
    glyphs.length > 0 && twoIdx > 0 ? glyphs[twoIdx - 1] : undefined;
  const customTwo: SavedTwo | undefined = rawAsset
    ? {
        id: rawAsset.id,
        label: rawAsset.label,
        cells: rawAsset.cells,
        style: rawAsset.glyphStyle as SavedTwo["style"],
        noGap: rawAsset.noGap,
        cols: rawAsset.cols,
        rows: rawAsset.rows,
        asset: rawAsset.uploadedAsset,
      }
    : undefined;

  return (
    <>
      <span
        ref={measureRef}
        className={`absolute invisible font-rounded font-black text-4xl lg:text-6xl`}
        aria-hidden="true"
      >
        x
      </span>
      <div
        className={`flex items-baseline justify-center gap-0 pointer-events-none ${className ?? ""}`}
      >
        <span className="  font-rounded font-black text-4xl lg:text-6xl lg:tracking-tight">
          {STEPS[textStep]}
        </span>
        {xHeight !== null && (
          <InlineTwoGlyph xHeight={xHeight} custom={customTwo} />
        )}
      </div>
    </>
  );
}
