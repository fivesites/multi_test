"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUI } from "@/context/UIContext";
import Link from "next/link";

type Phase = "p1" | "p2" | "p3" | "p4";

export default function MultiFooter() {
  const { aboutRef } = useUI();
  const [phase, setPhase] = useState<Phase>("p1");

  useEffect(() => {
    const update = () => {
      const el = aboutRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.8) {
        setPhase("p1");
        return;
      }
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, -rect.top / scrollable) : 1;
      if (progress < 0.33) setPhase("p2");
      else if (progress < 0.66) setPhase("p3");
      else setPhase("p4");
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [aboutRef]);

  const bgClass =
    phase === "p1"
      ? "bg-lyx"
      : phase === "p2"
        ? "bg-lax"
        : phase === "p3"
          ? "bg-lava"
          : "bg-liguriskt";

  return (
    <footer
      className={`absolut bottom-0 flex z-30 ${bgClass} transition-colors duration-500 text-lader text-lg font-medium font-visual leading-tight w-full flex-col items-center justify-center lg:items-start lg:justify-start min-h-[45vh]`}
    >
      <div className="flex flex-col items-center justify-center lg:justify-start lg:items-start px-4 pt-8 lg:px-8 h-full">
        <svg
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-24 h-24 mb-4"
        >
          <rect
            width="300"
            height="300"
            transform="matrix(-1 0 0 1 300 0)"
            className="fill-lader"
          />
          <path
            d="M112 111V30H94.153L78.0331 67.3757C77.3423 68.9957 76.6514 69.8057 75.5 69.8057C74.1183 69.8057 73.5426 69.2271 72.7366 67.3757L56.7319 30H39V111H51.7808V52.2171H56.2713V61.2429H60.7618V74.4343H65.2524V83.46H85.7476V74.4343H90.2382V61.2429H94.7287V52.2171H99.2192V111H112Z"
            className="fill-lyx"
          />
        </svg>

        <div className="flex items-baseline font-visual font-medium">
          <Button
            variant="nav"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Projects
          </Button>
          <Button variant="nav" className="px-0 pointer-events-none mr-1">
            ,
          </Button>
          <Button
            variant="nav"
            onClick={() =>
              aboutRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          >
            About
          </Button>
          <Button variant="nav" className="px-0 pointer-events-none mr-1">
            ,
          </Button>
          <Button variant="nav" asChild>
            <Link href="mailto:hello@multi2.co">Connect</Link>
          </Button>
        </div>

        <p className="text-center">
          Copyright Multi² 2026. All rights reserved.
        </p>

        <p className=" text-center ">
          Multi² is pronounced &ldquo;Multisquared&rdquo;
        </p>
        <div className="flex items-baseline font-visual font-medium">
          <Button variant="nav" asChild>
            <Link href="mailto:hello@multi2.co">hello@multi2.co</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
