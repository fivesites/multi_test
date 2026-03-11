"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const SLIDES = [
  {
    src: "/bjork-berries/bjork-berries_1920_1080_1.png",
    title: "Winter Whispers",
    client: "Björk & Berries",
  },
  {
    src: "/jureskogs/reklam_dokumentation_2503_Jureskogs_237_TUSCH.jpg",
    title: "Go Wild",
    client: "Jureskogs",
  },
  {
    src: "/mellotron/V1-low res Markus.jpg",
    title: "Mellotron M400D",
    client: "Mellotron",
  },
  {
    src: "/bjork-berries/bjork-berries_1920_1080_2.png",
    title: "Winter Whispers",
    client: "Björk & Berries",
  },
  {
    src: "/jureskogs/231109_Jureskogs_kampanj+meny_H23_07_blt_danne_leverans_lowres.jpg",
    title: "Go Wild",
    client: "Jureskogs",
  },
];

const AUTO_ADVANCE_MS = 8500;

export default function Carousel({
  disableBlur = false,
}: {
  disableBlur?: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const [blurPx, setBlurPx] = useState(disableBlur ? 0 : 14);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(
      () => setCurrent((c) => (c + 1) % SLIDES.length),
      AUTO_ADVANCE_MS,
    );
    return () => clearInterval(id);
  }, []);

  // Scroll-driven blur (only when not controlled externally)
  useEffect(() => {
    if (disableBlur) return;
    const update = () => {
      const progress = Math.min(1, window.scrollY / (window.innerHeight * 0.4));
      setBlurPx(14 * (1 - progress));
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [disableBlur]);

  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onMouseMove={
        disableBlur
          ? undefined
          : (e) => {
              const rect = containerRef.current?.getBoundingClientRect();
              if (rect)
                setMousePos({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
            }
      }
      onMouseLeave={disableBlur ? undefined : () => setMousePos(null)}
    >
      {/* Carousel — simple CSS crossfade */}
      {SLIDES.map(({ src }, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Blur overlay with cursor lens cutout */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none transition-[backdrop-filter] duration-300"
        style={{
          backdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
          WebkitBackdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
          maskImage:
            mousePos && blurPx > 0
              ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, transparent 80px, black 180px)`
              : undefined,
          WebkitMaskImage:
            mousePos && blurPx > 0
              ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, transparent 80px, black 180px)`
              : undefined,
        }}
      />

      {/* Static gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t from-foreground/80 to-transparent z-10" />

      {/* Click zones */}
      <button
        onClick={prev}
        className="absolute inset-y-0 left-0 w-1/2 z-10 cursor-w-resize focus:outline-none"
        aria-label="Previous image"
      />
      <button
        onClick={next}
        className="absolute inset-y-0 right-0 w-1/2 z-10 cursor-e-resize focus:outline-none"
        aria-label="Next image"
      />

      {/* Slide info */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2  z-20 pointer-events-none flex w-full justify-between lg:justify-center lg:gap-x-0 lg:grid lg:grid-cols-3 px-3 items-center gap-3 pb-3 ">
        <Badge variant="ghost" className="text-background">
          {current + 1} / {SLIDES.length}
        </Badge>
        <Badge variant="ghost" className="text-background">
          {SLIDES[current].client}
        </Badge>
        <Badge variant="ghost" className="text-background">
          {SLIDES[current].title}
        </Badge>
      </div>
    </div>
  );
}
