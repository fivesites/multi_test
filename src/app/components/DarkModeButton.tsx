"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TypedWord from "./TypedWord";

const MS = 22;

export default function DarkModeButton({
  className,
  visible = true,
  lightDelay = 0,
}: {
  className?: string;
  visible?: boolean;
  lightDelay?: number;
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

  const label = dark ? "Light" : "Dark";
  const bwDelay = lightDelay + (5 + 2) * MS;

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1">
      <span className="inline-flex items-baseline whitespace-nowrap">
        <Button variant="nav" onClick={toggleDark} className={className}>
          <TypedWord text={label} visible={visible} delay={lightDelay} />
        </Button>
        <TypedWord
          text=", "
          visible={visible}
          delay={lightDelay + 5 * MS}
          className="text-3xl lg:text-2xl text-lava leading-tight tracking-wide"
        />
      </span>
      <Button variant={bw ? "link" : "nav"} onClick={toggleBw} className={className}>
        <TypedWord text="B/W" visible={visible} delay={bwDelay} />
      </Button>
    </span>
  );
}
