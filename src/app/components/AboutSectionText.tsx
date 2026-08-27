"use client";

import { useEffect, useState } from "react";
import { usePresence } from "motion/react";
import TypedWord from "./TypedWord";
import { useUI } from "@/context/UIContext";
import { cn } from "@/lib/utils";
import { Http2ServerRequest } from "node:http2";

const TYPING_MS_PER_CHAR = 22;
const ERASING_MS_PER_CHAR = 14;
const ERASE_SPEED = 0.2;

export default function AboutSectionText({
  plainText,
  text,
  className,
}: {
  plainText: string;
  text?: string;
  /** Overrides the standalone-page padding/scroll when embedded in a column. */
  className?: string;
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
  }, [textVisible, plainText, text, notifyContentDone]);

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
    <div
      className={cn(
        "min-h-full lg:h-[66.6dvh] flex flex-col items-start justify-start lg:items-center pt-6 pb-6 px-6 lg:px-24 lg:justify-center  overflow-y-scroll lg:grid lg:grid-cols-12 gap-6   ",
        className,
      )}
    >
      <h2 className="hidden  font-visual  text-lg font-light   lg:text-5xl  lg:col-span-6 lg:text-left lg:col-start-1 lg:flex justify-start lowercase ">
        {plainText}
      </h2>
      {text && (
        <p className="lg:col-span-5 f text-base font-diatype font-normal">
          {text}
        </p>
      )}
    </div>
  );
}
