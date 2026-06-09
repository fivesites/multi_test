"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

type Phase = "p1" | "p2" | "p3" | "p4";

export default function AboutSectionText({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("p1");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();

      if (parentRect.top > 0) {
        setPhase("p1");
        return;
      }

      const scrollable = parentRect.height - el.offsetHeight;
      const progress =
        scrollable > 0 ? Math.min(1, -parentRect.top / scrollable) : 1;

      if (progress < 0.33) setPhase("p2");
      else if (progress < 0.66) setPhase("p3");
      else setPhase("p4");
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (phase !== "p4") {
      setBlink(false);
      return;
    }
    const id = setInterval(() => setBlink((b) => !b), 600);
    return () => clearInterval(id);
  }, [phase]);

  const colorClass =
    phase === "p1"
      ? "text-lava"
      : phase === "p2"
        ? "text-lappar"
        : phase === "p3"
          ? "text-liguriskt"
          : "text-ladar";

  const lineColor = `${colorClass} transition-colors duration-0`;

  return (
    <div
      ref={ref}
      className="sticky mt-4 top-16 lg:top-21 z-10 h-dvh flex flex-col items-center justify-start lg:items-start px-4 lg:px-8"
    >
      <h1
        className={`font-visual text-6xl lg:text-9xl uppercase leading-none text-center lg:text-left font-normal tracking-tight lg:tracking-tighter lg:leading-[0.9] ${lineColor}`}
      >
        We multiply what matters
      </h1>
      {text && (
        <p
          className={`font-visual text-2xl lg:text-3xl tracking-wide max-w-5xl font-medium leading-[1.1] mt-1 text-center lg:text-left lg:tracking-normal lg:font-normal lg:indent-16 lg:mt-2 delay-150 ${lineColor}`}
        >
          {text}
        </p>
      )}
      <Link
        href="mailto:hello@multi2.co"
        className={`font-visual text-3xl lg:text-7xl w-full uppercase leading-[1] font-medium tracking-normal mt-2 lg:mt-2 delay-300 max-w-sm  text-center lg:text-left  lg:max-w-3xl lg:indent-16 ${lineColor} `}
      >
        connect with us
      </Link>
    </div>
  );
}
