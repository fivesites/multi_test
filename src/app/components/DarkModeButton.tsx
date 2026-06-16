"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import M2Button from "./M2Button";
import TypedWord from "./TypedWord";

const MS = 22;

export default function DarkModeButton({
  className,
  visible = true,
  lightDelay = 0,
  lg = false,
}: {
  className?: string;
  visible?: boolean;
  lightDelay?: number;
  lg?: boolean;
}) {
  const [dark, setDark] = useState(false);
  const [bw, setBw] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setBw(document.documentElement.classList.contains("bw"));
  }, []);

  function toggleDark() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }

  function toggleBw() {
    const next = !bw;
    document.documentElement.classList.toggle("bw", next);
    setBw(next);
  }

  const label = dark ? "Dark" : "Light";
  const bwDelay = lightDelay + (5 + 2) * MS;

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1 buttonTextSM buttonColors">
      <span className="inline-flex items-baseline whitespace-nowrap buttonTextSM buttonColors">
        <M2Button
          text={label}
          visible={visible}
          delay={lightDelay}
          active={dark}
          onClick={toggleDark}
          className={cn("", className)}
        />
        <TypedWord
          text=", "
          visible={visible}
          delay={lightDelay + 5 * MS}
          className=""
        />
      </span>
      <M2Button
        lg={lg}
        text="B/W"
        visible={visible}
        delay={bwDelay}
        onClick={toggleBw}
        className={cn(!bw && "", className)}
      />
    </span>
  );
}
