"use client";

import { useState, useEffect, useRef } from "react";
import MultiText from "./MultiText";

export default function MobileMultiTextHeader() {
  const [scrolled, setScrolled] = useState(false);
  const mainRef = useRef<Element | null>(null);

  useEffect(() => {
    mainRef.current = document.querySelector("main");
    const el = mainRef.current;
    if (!el) return;
    const update = () => setScrolled(el.scrollTop > 4);
    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => el.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className={`hidden sticky top-0 z-30  items-center justify-center transition-all duration-500 ease-out ${
        scrolled ? "h-16" : "h-0"
      }`}
    >
      <MultiText className="text-primary" textSize="text-4xl" frozen />
    </div>
  );
}
