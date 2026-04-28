"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import TextBlock from "./TextBlock";

const lines = [
  { text: "Twice the talent.", delay: 0 },
  { text: "Squared results.", delay: 1 },
];

const DISMISS_AFTER = 2200;

export default function Loader({ onDone }: { onDone?: () => void }) {
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDismissing(true), DISMISS_AFTER);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background w-full"
      animate={{ opacity: dismissing ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (dismissing) onDone?.();
      }}
    >
      <div className="flex flex-wrap w-full justify-center pt-4 px-4 gap-x-4 whitespace-normal">
        {lines.map(({ text, delay }) => (
          <TextBlock key={text} text={text} size="text-2xl" delay={delay} />
        ))}
      </div>
    </motion.div>
  );
}
