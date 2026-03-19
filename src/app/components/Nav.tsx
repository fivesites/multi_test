"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      if (scrolled < 50) setScrollState("top");
      else if (scrolled >= maxScroll - 50) setScrollState("bottom");
      else setScrollState("middle");
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Close menu when scrolling away from middle
  useEffect(() => {
    if (scrollState !== "middle") setOpen(false);
  }, [scrollState]);

  const handleClick = () => {
    if (scrollState === "top") {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    } else if (scrollState === "bottom") {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        variant="default"
        className={`w-full rounded-none shadow ${scrollState === "top" ? "bg-transparent animate-pulse" : ""} ${open ? "bg-background text-foreground" : ""}`}
        onClick={handleClick}
      >
        {scrollState === "top" && "Scroll down"}
        {scrollState === "middle" && (open ? "Close" : "Menu")}
        {scrollState === "bottom" && "Back to top"}
      </Button>
    </nav>
  );
}
