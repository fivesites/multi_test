"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DarkModeButton({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function setMode(next: boolean) {
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }

  return (
    <span className="flex items-baseline font-rounded text-2xl gap-1">
      <Button
        variant={!dark ? "link" : "nav"}
        onClick={() => setMode(false)}
        className={className}
      >
        Light
      </Button>
      <Button
        variant="nav"
        className="font-rounded px-0 leading-tight pointer-events-none"
      >
        /
      </Button>
      <Button
        variant={dark ? "link" : "nav"}
        onClick={() => setMode(true)}
        className={className}
      >
        Dark
      </Button>
    </span>
  );
}
