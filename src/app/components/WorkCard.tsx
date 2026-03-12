"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

type Slide = { type: "image"; url: string } | { type: "video"; url: string };

export function WorkCard({
  title,
  slug,
  backgroundColor,
  slides,
}: {
  title: string;
  slug: string;
  backgroundColor?: string;
  slides: Slide[];
}) {
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Autoplay carousel
  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      4000,
    );
    return () => clearInterval(id);
  }, [slides.length]);

  // Play/pause video when it becomes active
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === idx) v.play().catch(() => {});
      else { v.pause(); v.currentTime = 0; }
    });
  }, [idx]);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setIdx((i) => (i - 1 + slides.length) % slides.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setIdx((i) => (i + 1) % slides.length);
  };

  return (
    <Link
      href={`/work/${slug}`}
      className="relative block aspect-video overflow-hidden group"
      style={{ backgroundColor: backgroundColor ?? "#111" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Media slides */}
      {slides.map((slide, i) =>
        slide.type === "image" ? (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === idx ? 1 : 0 }}
          >
            <Image
              src={slide.url}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`object-cover transition-[filter] duration-500 ${
                hovered ? "blur-none" : "blur-[6px]"
              }`}
            />
          </div>
        ) : (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === idx ? 1 : 0 }}
          >
            <video
              ref={(el) => { videoRefs.current[i] = el; }}
              src={slide.url}
              muted
              loop
              playsInline
              className={`w-full h-full object-cover transition-[filter] duration-500 ${
                hovered ? "blur-none" : "blur-[6px]"
              }`}
            />
          </div>
        ),
      )}

      {/* Title overlay */}
      <div className="absolute inset-0 z-10 flex items-start p-4 pointer-events-none">
        <span className="text-white text-sm font-medium drop-shadow-sm">
          {title}
        </span>
      </div>

      {/* Prev / Next — only show when multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Next"
          >
            →
          </button>
          <span className="absolute bottom-3 right-3 z-10 text-white/40 text-xs font-mono pointer-events-none">
            {String(idx + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
        </>
      )}
    </Link>
  );
}
