"use client";

import { useEffect, useState } from "react";
import { usePresence } from "motion/react";
import TypedWord from "./TypedWord";

const EMAIL = "hello@multi2.co";
const ERASING_MS_PER_CHAR = 14;
const ERASE_SPEED = 0.2;

export default function ConnectSection() {
  const [isPresent, safeToRemove] = usePresence();
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    setTextVisible(true);
  }, []);

  useEffect(() => {
    if (isPresent) return;
    setTextVisible(false);
    const eraseMs = EMAIL.length * ERASING_MS_PER_CHAR * ERASE_SPEED + 100;
    const t = setTimeout(safeToRemove, eraseMs);
    return () => clearTimeout(t);
  }, [isPresent, safeToRemove]);

  return (
    <div className="min-h-full flex flex-col items-center lg:items-start justify-start px-4 lg:px-8 pb-12 text-lava">
      <a
        href={`mailto:${EMAIL}`}
        className="font-visual font-medium uppercase tracking-normalt text-4xl lg:text-4xl text-lava hover:text-lava transition-colors duration-200 leading-none"
      >
        <TypedWord
          text={EMAIL}
          visible={textVisible}
          delay={0}
          eraseSpeed={ERASE_SPEED}
        />
      </a>
    </div>
  );
}
