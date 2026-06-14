"use client";

import { useEffect, useState } from "react";
import { usePresence } from "motion/react";
import TypedWord from "./TypedWord";

const TYPING_MS_PER_CHAR = 22;
const ERASING_MS_PER_CHAR = 14;
const ERASE_SPEED = 0.2;

export default function AboutSectionText({
  plainText,
  text,
}: {
  plainText: string;
  text?: string;
}) {
  const [isPresent, safeToRemove] = usePresence();
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    setTextVisible(true);
  }, []);

  useEffect(() => {
    if (isPresent) return;
    setTextVisible(false);
    const totalChars = plainText.length + (text?.length ?? 0);
    const eraseMs = totalChars * ERASING_MS_PER_CHAR * ERASE_SPEED + 100;
    const t = setTimeout(safeToRemove, eraseMs);
    return () => clearTimeout(t);
  }, [isPresent, safeToRemove, plainText, text]);

  const paraDelay = plainText.length * TYPING_MS_PER_CHAR;

  return (
    <div className="min-h-full flex flex-col items-center justify-start lg:items-start px-4 lg:px-8 text-lava">
      <h1 className="font-visual text-6xl lg:text-8xl max-w-3xl uppercase leading-none text-center lg:text-left font-normal tracking-tight lg:tracking-tighter lg:leading-[0.9]">
        <TypedWord
          text={plainText}
          visible={textVisible}
          delay={0}
          eraseSpeed={ERASE_SPEED}
        />
      </h1>
      {text && (
        <p className="font-visual text-xl lg:text-2xl tracking-normal max-w-4xl font-medium leading-[1.1] lg:leading-[1.2] mt-1 text-center lg:text-left lg:tracking-wide lg:font-normal  lg:mt-2">
          <TypedWord
            text={text}
            visible={textVisible}
            delay={paraDelay}
            eraseSpeed={ERASE_SPEED}
          />
        </p>
      )}
    </div>
  );
}
