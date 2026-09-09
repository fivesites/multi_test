"use client";

import { useEffect, useState } from "react";
import { usePresence } from "motion/react";
import { useUI } from "@/context/UIContext";
import { useCopyBody, useCopyEntry } from "@/context/CopyContext";
import { cn } from "@/lib/utils";

const TYPING_MS_PER_CHAR = 22;
const ERASING_MS_PER_CHAR = 14;
const ERASE_SPEED = 0.2;

/**
 * The "our story" copy. Reads a Copy entry by key — `about-short` by default
 * (the home page block); the /about page passes `about-long`. `plainText` /
 * `text` still override the fetched copy when a caller wants to supply its own.
 */
export default function AboutSectionText({
  copyKey = "about-short",
  plainText,
  text,
  className,
}: {
  /** Copy entry key to pull the story from. */
  copyKey?: string;
  plainText?: string;
  text?: string;
  /** Overrides the standalone-page padding/scroll when embedded in a column. */
  className?: string;
}) {
  const { notifyContentDone } = useUI();
  const entry = useCopyEntry(copyKey);
  const body = useCopyBody(copyKey);

  const resolvedText = text ?? body ?? undefined;
  const resolvedPlain = plainText ?? entry?.plainText ?? "";

  const [isPresent, safeToRemove] = usePresence();
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    setTextVisible(true);
  }, []);

  useEffect(() => {
    if (!textVisible) return;
    const doneMs =
      (resolvedPlain.length + (resolvedText?.length ?? 0)) * TYPING_MS_PER_CHAR;
    const t = setTimeout(notifyContentDone, doneMs);
    return () => clearTimeout(t);
  }, [textVisible, resolvedPlain, resolvedText, notifyContentDone]);

  useEffect(() => {
    if (isPresent) return;
    setTextVisible(false);
    const totalChars = resolvedPlain.length + (resolvedText?.length ?? 0);
    const eraseMs = totalChars * ERASING_MS_PER_CHAR * ERASE_SPEED + 100;
    const t = setTimeout(safeToRemove, eraseMs);
    return () => clearTimeout(t);
  }, [isPresent, safeToRemove, resolvedPlain, resolvedText]);

  return (
    <div
      className={cn(
        " flex flex-col  items-start justify-start space-y-12 lg:space-y-12   pb-3 px-3 lg:px-0   overflow-y-scroll  gap-0 w-full  ",
        className,
      )}
    >
      {resolvedText && (
        <p className="indent-[calc(33.3vw-1rem)]  lg:indent-0 pText  px-3 lg:px-3  lg:mb-0 lowercase  lg:max-w-2xl whitespace-pre-line ">
          {resolvedText}
        </p>
      )}
    </div>
  );
}
