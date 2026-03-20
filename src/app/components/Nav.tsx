"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrollState, setScrollState] = useState<"top" | "middle" | "bottom">(
    "top",
  );
  const mainRef = useRef<Element | null>(null);

  useEffect(() => {
    mainRef.current = document.querySelector("main");
    const el = mainRef.current;
    if (!el) return;

    const update = () => {
      const scrolled = el.scrollTop;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;
      if (scrolled < 1) setScrollState("top");
      else if (scrolled >= maxScroll - 50) setScrollState("bottom");
      else setScrollState("middle");
    };

    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => el.removeEventListener("scroll", update);
  }, []);

  // Close menu when leaving middle state
  useEffect(() => {
    if (scrollState !== "middle") setOpen(false);
  }, [scrollState]);

  const handleClick = () => {
    const el = mainRef.current;
    if (scrollState === "top") {
      el?.scrollBy({ top: el.clientHeight, behavior: "smooth" });
    } else if (scrollState === "bottom") {
      el?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setOpen((o) => !o);
    }
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-0 w-full">
      {open && (
        <div className="flex flex-col items-center gap-0 w-full">
          {links.map((l) => (
            <Button
              key={l.href}
              variant="secondary"
              asChild
              className="w-full rounded-none"
              onClick={() => setOpen(false)}
            >
              <Link href={l.href}>{l.label}</Link>
            </Button>
          ))}
        </div>
      )}
      <Button
        variant="ghost"
        className={`w-full rounded-none ${open ? "bg-background text-foreground  hover:bg-background" : "bg-transparent text-background hover:bg-transparent"}`}
        onClick={handleClick}
      >
        {scrollState === "top" && "Scroll down"}
        {scrollState === "middle" && (open ? "Close" : "Menu")}
        {scrollState === "bottom" && "Back to top"}
      </Button>
    </nav>
  );
}
