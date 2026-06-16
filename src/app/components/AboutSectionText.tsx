"use client";

import { useEffect, useState } from "react";
import { usePresence } from "motion/react";
import TypedWord from "./TypedWord";
import { useUI } from "@/context/UIContext";

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
  const { notifyContentDone } = useUI();
  const [isPresent, safeToRemove] = usePresence();
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    setTextVisible(true);
  }, []);

  useEffect(() => {
    if (!textVisible) return;
    const doneMs =
      (plainText.length + (text?.length ?? 0)) * TYPING_MS_PER_CHAR;
    const t = setTimeout(notifyContentDone, doneMs);
    return () => clearTimeout(t);
  }, [textVisible, plainText, text]);

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
    <div className="min-h-full flex flex-col items-start justify-start lg:items-start px-8 lg:px-8 text-lava pb-8 overflow-y-scroll">
      <h1 className="h2Text mt-0 mb-8 lg:mb-4 ">
        <TypedWord
          text={plainText}
          visible={textVisible}
          delay={0}
          eraseSpeed={ERASE_SPEED}
          cursor={false}
        />
      </h1>
      {text && (
        <p className="pText ">
          <TypedWord
            text={text}
            visible={textVisible}
            delay={paraDelay}
            eraseSpeed={ERASE_SPEED}
            cursor={false}
          />
        </p>
      )}
    </div>
  );
}
