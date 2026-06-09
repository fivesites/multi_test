"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

const DISMISS_AFTER = 3000;

const PALETTE = [
  "text-lyx",
  "text-lax",
  "text-lava",
  "text-lappar",
  "text-liguriskt",
  "text-lader",
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
      className="fixed inset-0 z-50 flex items-start justify-start bg-background w-full h-dvh"
      animate={{ opacity: dismissing ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (dismissing) onDone?.();
      }}
    >
      <motion.p
        className=" font-visual uppercase font-medium text-4xl pt-2 px-4 text-center flex flex-wrap justify-center gap-x-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {words.map((word, i) => (
          <span key={i} className={PALETTE[i % PALETTE.length]}>
            {word}
          </span>
        ))}
      </motion.p>
    </motion.div>
  );
}
