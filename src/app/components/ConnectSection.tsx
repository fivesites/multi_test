"use client";

import { useEffect, useState } from "react";
import { usePresence } from "motion/react";
import M2Button from "./M2Button";
import { useUI } from "@/context/UIContext";

const EMAIL = "hello@multi2.co";
const TYPING_MS_PER_CHAR = 22;
const ERASING_MS_PER_CHAR = 14;
const ERASE_SPEED = 0.2;

export default function ConnectSection() {
  const { notifyContentDone } = useUI();
  const [isPresent, safeToRemove] = usePresence();
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    setTextVisible(true);
  }, []);

  useEffect(() => {
    if (!textVisible) return;
    const t = setTimeout(notifyContentDone, EMAIL.length * TYPING_MS_PER_CHAR);
    return () => clearTimeout(t);
  }, [textVisible, notifyContentDone]);

  useEffect(() => {
    if (isPresent) return;
    setTextVisible(false);
    const eraseMs = EMAIL.length * ERASING_MS_PER_CHAR * ERASE_SPEED + 100;
    const t = setTimeout(safeToRemove, eraseMs);
    return () => clearTimeout(t);
  }, [isPresent, safeToRemove]);

  return (
    <div className="min-h-full flex flex-col items-start lg:items-start justify-start px-8 lg:px-8 pb-12  ">
      <M2Button
        className="pText uppercase"
        text={EMAIL}
        visible={textVisible}
        delay={0}
      />
    </div>
  );
}
