"use client";

import { useState } from "react";
import { THEMES, useTheme } from "@/context/ThemeContext";
import CheckButton from "./CheckButton";
import ColorButton from "./ColorButton";

export default function UnderConstruction() {
  const [dismissed, setDismissed] = useState(false);
  const { theme, cycleTheme } = useTheme();
  if (dismissed) return null;

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div className="fixed top-0 left-0 h-dvh w-full z-[300] flex flex-col items-start justify-center gap-y-6 py-12 px-6 text-left bg-background ">
      <CheckButton
        label="close"
        active
        size="label"
        onClick={() => setDismissed(true)}
        className="absolute top-6 left-6"
      />
      <ColorButton
        label={current.label}
        swatch="text-primary"
        active
        onClick={cycleTheme}
        className="absolute top-6 right-6 w-auto h-auto px-0"
      />
      <h1 className="font-visual h1Text text-primary leading-[0.9]  ">
        under construction
      </h1>
      <h2 className="font-visual h2Text text-primary   ">
        {"("}multi2.co coming soon{")"}
      </h2>
    </div>
  );
}
