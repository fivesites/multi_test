"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TypedWord from "./TypedWord";

const MS = 22;

export default function DarkModeButton({
  className,
  visible = true,
  lightDelay = 0,
  darkDelay = 0,
}: {
  className?: string;
  visible?: boolean;
  lightDelay?: number;
  darkDelay?: number;
}) {
  const [dark, setDark] = useState(false);
  const [bw, setBw] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setBw(document.documentElement.classList.contains("bw"));
  }, []);

  function setMode(next: boolean) {
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }

  function toggleBw() {
    const next = !bw;
    document.documentElement.classList.toggle("bw", next);
    setBw(next);
  }

  const bwDelay = darkDelay + (4 + 2) * MS; // after "Dark" (4) + ", " (2)

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1">
      <span className="inline-flex items-baseline whitespace-nowrap">
        <Button variant={!dark ? "link" : "nav"} onClick={() => setMode(false)} className={className}>
          <TypedWord text="Light" visible={visible} delay={lightDelay} />
        </Button>
        <TypedWord text=", " visible={visible} delay={lightDelay + 5 * MS} className="text-3xl lg:text-2xl text-lava leading-tight tracking-wide" />
      </span>
      <span className="inline-flex items-baseline whitespace-nowrap">
        <Button variant={dark ? "link" : "nav"} onClick={() => setMode(true)} className={className}>
          <TypedWord text="Dark" visible={visible} delay={darkDelay} />
        </Button>
        <TypedWord text=", " visible={visible} delay={darkDelay + 4 * MS} className="text-3xl lg:text-2xl text-lava leading-tight tracking-wide" />
      </span>
      <Button variant={bw ? "link" : "nav"} onClick={toggleBw} className={className}>
        <TypedWord text="B/W" visible={visible} delay={bwDelay} />
      </Button>
    </span>
  );
}
