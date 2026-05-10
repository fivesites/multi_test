"use client";

import {
  prepareWithSegments,
  layoutOptimal,
  hyphenateText,
  type MeasuredLine,
} from "./knuth-plass";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function TextBlock({
  text,
  size = "text-2xl",
  delay = 0,
  justify = true,
  wordSpacing = 1,
}: {
  text: string;
  size?: string;
  delay?: number;
  justify?: boolean;
  wordSpacing?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [state, setState] = useState<{
    lines: MeasuredLine[];
    normalSpaceWidth: number;
  } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !text) return;
    const font = getComputedStyle(el).font;
    const width = el.getBoundingClientRect().width;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = font;
    const normalSpaceWidth = ctx.measureText(" ").width;
    const hyphenWidth = ctx.measureText("-").width;
    const prepared = prepareWithSegments(hyphenateText(text), font);
    const lines = layoutOptimal(prepared, width, normalSpaceWidth, hyphenWidth);
    setState({ lines, normalSpaceWidth });
  }, [text]);

  return (
    <p
      ref={ref}
      className={`${size} font-rounded text-red-100 [text-shadow:0_0_6px_#ef4444,0_0_16px_#ef4444,0_0_32px_#ef4444,0_0_60px_rgba(239,68,68,0.6)] [.no-glow_&]:text-red-500 [.no-glow_&]:[text-shadow:none] leading-tight px-0`}
    >
      {state === null ? (
        <span style={{ visibility: "hidden" }}>{text}</span>
      ) : (
        <motion.span
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.08, delayChildren: delay },
            },
          }}
        >
          {state.lines.map((line, i) => {
            const isJustified =
              justify &&
              line.ending !== "paragraph-end" &&
              line.spaceCount > 0 &&
              line.naturalWidth > line.maxWidth * 0.6;
            const spaceW = isJustified
              ? (line.maxWidth - line.wordWidth) / line.spaceCount
              : state.normalSpaceWidth * wordSpacing;
            return (
              <motion.span
                key={i}
                className="flex"
                variants={{
                  hidden: { opacity: 0, y: 4 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
                }}
              >
                {line.segments.map((seg, j) =>
                  seg.kind === "text" ? (
                    <span key={j}>{seg.text}</span>
                  ) : (
                    <span
                      key={j}
                      style={{ display: "inline-block", width: spaceW }}
                    />
                  ),
                )}
              </motion.span>
            );
          })}
        </motion.span>
      )}
    </p>
  );
}
