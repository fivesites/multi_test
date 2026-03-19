"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const VARS = [
  { label: "Background", key: "--background" },
  { label: "Foreground", key: "--foreground" },
  { label: "Primary", key: "--primary" },
  { label: "Primary FG", key: "--primary-foreground" },
  { label: "Secondary", key: "--secondary" },
  { label: "Secondary FG", key: "--secondary-foreground" },
  { label: "Accent", key: "--accent" },
  { label: "Accent FG", key: "--accent-foreground" },
  { label: "Muted", key: "--muted" },
  { label: "Muted FG", key: "--muted-foreground" },
];

function getComputedHex(varName: string): string {
  const el = document.createElement("div");
  el.style.color = `var(${varName})`;
  document.body.appendChild(el);
  const rgb = getComputedStyle(el).color;
  document.body.removeChild(el);
  const match = rgb.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!match) return "#000000";
  return (
    "#" +
    [match[1], match[2], match[3]]
      .map((n) => parseInt(n).toString(16).padStart(2, "0"))
      .join("")
  );
}

export default function ThemePicker() {
  const [colors, setColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initial: Record<string, string> = {};
    for (const { key } of VARS) {
      initial[key] = getComputedHex(key);
    }
    setColors(initial);
  }, []);

  const saveOverrides = (overrides: Record<string, string>) => {
    const encoded = encodeURIComponent(JSON.stringify(overrides));
    document.cookie = `theme-overrides=${encoded}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const handleChange = (key: string, value: string) => {
    setColors((prev) => {
      const next = { ...prev, [key]: value };
      saveOverrides(next);
      return next;
    });
    document.documentElement.style.setProperty(key, value);
  };

  const handleReset = () => {
    document.cookie = "theme-overrides=; path=/; max-age=0";
    for (const { key } of VARS) {
      document.documentElement.style.removeProperty(key);
    }
    const reset: Record<string, string> = {};
    for (const { key } of VARS) {
      reset[key] = getComputedHex(key);
    }
    setColors(reset);
  };

  const handleWriteToCSS = async () => {
    await fetch("/api/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vars: colors }),
    });
  };

  return (
    <div className="flex flex-wrap gap-8 items-end">
      {VARS.map(({ label, key }) => (
        <div key={key} className="flex flex-col gap-2">
          <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            {label}
          </label>
          <input
            type="color"
            value={colors[key] ?? "#000000"}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-12 h-12 rounded cursor-pointer border border-border bg-transparent"
          />
          <span className="font-mono text-xs text-muted-foreground">{key}</span>
        </div>
      ))}
      <div className="flex flex-col gap-2 mb-1">
        <Button variant="default" size="sm" onClick={handleWriteToCSS}>
          Write to globals.css
        </Button>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
