"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TypedWord from "./TypedWord";

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

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function setMode(next: boolean) {
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }

  return (
    <span className="flex items-baseline font-rounded text-xl lg:text-lg gap-0">
      <Button
        variant={!dark ? "link" : "nav"}
        onClick={() => setMode(false)}
        className={className}
      >
        <TypedWord text="Light" visible={visible} delay={lightDelay} />
      </Button>
      <TypedWord
        text=", "
        visible={visible}
        delay={lightDelay + 5 * 22}
        className="mr-1 text-lader dark:text-lax"
      />
      <Button
        variant={dark ? "link" : "nav"}
        onClick={() => setMode(true)}
        className={className}
      >
        <TypedWord text="Dark" visible={visible} delay={darkDelay} />
      </Button>
    </span>
  );
}
