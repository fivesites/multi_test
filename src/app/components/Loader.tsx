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
      className="fixed inset-0 z-50 flex items-center justify-start bg-background w-full h-dvh text-foreground"
      animate={{ opacity: dismissing ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (dismissing) onDone?.();
      }}
    >
      <div className="flex flex-wrap w-full justify-center items-baseline whitespace-normal uppercase px-2 lg:px-16">
        {lines.map(({ text, delay }) => (
          <TextBlock
            key={text}
            text={text}
            size="text-4xl lg:text-7xl"
            delay={delay}
          />
        ))}
      </div>
    </motion.div>
  );
}
