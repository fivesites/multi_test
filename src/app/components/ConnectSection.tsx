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
    <div className="min-h-full flex flex-col items-start lg:items-start justify-start px-8 lg:px-8 pb-12 text-lava">
      <a
        href={`mailto:${EMAIL}`}
        className="font-visual text-3xl lg:text-4xl max-w-7xl uppercase leading-none lg:text-left font-medium lg:font-medium lg:mb-4   tracking-wide lg:tracking-normal lg:leading-[0.9]"
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
