"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import TextBlock from "./TextBlock";

const DISMISS_AFTER = 3000;

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

  const lines = [{ text: tagline, delay: 0 }];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background w-full h-dvh text-foreground"
      animate={{ opacity: dismissing ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (dismissing) onDone?.();
      }}
    >
      <div className="flex flex-wrap w-full justify-center p-16 gap-x-4 whitespace-normal">
        {lines.map(({ text, delay }) => (
          <TextBlock key={text} text={text} size="text-base" delay={delay} />
        ))}
      </div>
    </motion.div>
  );
}
