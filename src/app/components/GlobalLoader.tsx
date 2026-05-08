"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Loader from "./Loader";

export default function GlobalLoader({ tagline }: { tagline: string }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <Loader tagline={tagline} onDone={() => setVisible(false)} />
    </AnimatePresence>
  );
}
