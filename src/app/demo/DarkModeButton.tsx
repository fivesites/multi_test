"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LightbulbIcon, LightbulbOffIcon } from "lucide-react";

export default function DarkModeButton({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }

  return (
    <Button
      variant={dark ? "glow" : "link"}
      onClick={toggle}
      className={className}
    >
      <div
        className="w-4 h-4 rounded-full shrink-0 self-center"
        style={{
          backgroundColor: dark ? "#fee2e2" : "#d4d4d4",
          boxShadow: dark
            ? "0 0 6px #ef4444, 0 0 16px #ef4444, 0 0 32px rgba(239,68,68,0.6)"
            : "none",
        }}
      />

      {dark ? "Lights Off" : "Lights On"}
    </Button>
  );
}
