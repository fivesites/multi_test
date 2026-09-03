"use client";

import { useEffect, useState } from "react";
import { usePresence } from "motion/react";
import TypedHeading from "./TypedHeading";
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
        " grid grid-cols-3 lg:grid-cols-8  items-start justify-start space-y-12 lg:space-y-12   pb-3 px-0 lg:px-0   overflow-y-scroll  gap-0 w-full  ",
        className,
      )}
    >
      <TypedHeading
        text="We Multiply What Matters"
        className="  h2Text  col-start-2 col-span-2 lg:col-start-2 lg:col-span-6 pr-4.5 lg:pr-0    "
      />
      {text && (
        <p className="col-start-1 col-span-3 lg:col-start-2 lg:col-span-6 indent-[calc(33.3vw-1rem)]  lg:indent-0 pText  px-3 lg:px-0  lg:mb-0 lowercase  lg:max-w-4xl ">
          {text}
        </p>
      )}
    </div>
  );
}
