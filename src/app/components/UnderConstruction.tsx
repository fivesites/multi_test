"use client";

import { useState } from "react";
import CheckButton from "./CheckButton";

export default function UnderConstruction() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 h-dvh w-full z-[300] flex flex-col items-center justify-center gap-y-6 py-12 px-6 text-center bg-background">
      <CheckButton
        label="close"
        active
        size="label"
        onClick={() => setDismissed(true)}
        className="absolute top-6 left-6"
      />
      <h1 className="font-visual h1Text text-primary ">under construction</h1>
    </div>
  );
}
