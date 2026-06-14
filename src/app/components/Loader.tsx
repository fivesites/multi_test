"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import TypedWord from "./TypedWord";

const DISMISS_AFTER = 3000;
const WORD_STAGGER = 180; // ms between words starting to type

const PALETTE = [
  "text-lava",
  "text-lava",
  "text-lava",
  "text-lava",
  "text-lava",
  "text-lava",
];

export default function Loader({
  tagline,
  onDone,
}: {
  tagline: string;
  onDone?: () => void;
}) {
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDismissing(true), DISMISS_AFTER);
    return () => clearTimeout(t);
  }, []);

  const words = tagline.split(" ");

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-start bg-background w-full pt-2 lg:pt-8 px-8 h-dvh"
      animate={{ opacity: dismissing ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (dismissing) onDone?.();
      }}
    >
      <p className="font-visual  font-medium text-xl lg:text-lg pt-2 px-4 text-center tracking-wide lg:text-left flex flex-wrap uppercase justify-center gap-x-2 lg:gap-x-1 ">
        {words.map((word, i) => (
          <TypedWord
            key={i}
            text={word}
            visible={!dismissing}
            delay={i * WORD_STAGGER}
            eraseDelay={(words.length - 1 - i) * WORD_STAGGER}
            className={PALETTE[i % PALETTE.length]}
          />
        ))}
      </p>
    </motion.div>
  );
}
