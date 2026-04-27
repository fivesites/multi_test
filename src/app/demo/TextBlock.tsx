"use client";

import {
  prepareWithSegments,
  layoutOptimal,
  hyphenateText,
  type MeasuredLine,
} from "./knuth-plass";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function TextBlock({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [state, setState] = useState<{
    lines: MeasuredLine[];
    normalSpaceWidth: number;
  } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
  }, []);

  return (
    <p
      ref={ref}
      className="text-2xl font-rounded leading-tight tracking-normal text-red-500  max-w-7xl"
    >
      {state === null ? (
        <span style={{ visibility: "hidden" }}>{text}</span>
      ) : (
        <motion.span
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {state.lines.map((line, i) => {
            const isJustified =
              line.ending !== "paragraph-end" &&
              line.spaceCount > 0 &&
              line.naturalWidth > line.maxWidth * 0.6;
            const spaceW =
              (isJustified
                ? (line.maxWidth - line.wordWidth) / line.spaceCount
                : state.normalSpaceWidth) * 0.75;
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
