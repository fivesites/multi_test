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
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  // Play/pause video when it becomes active
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === idx) v.play().catch(() => {});
      else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [idx]);

  return (
    <Link
      href={`/work/${slug}`}
      className="relative block h-[90vh] overflow-hidden group"
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
              className="object-cover"
            />
          </div>
        ) : (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === idx ? 1 : 0 }}
          >
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={slide.url}
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        ),
      )}

      {/* Color overlay — fades out on hover to reveal media */}
      <div
        className="absolute inset-0 z-10 transition-opacity duration-500"
        style={{
          backgroundColor: backgroundColor ?? "#111",
          opacity: hovered ? 0 : 1,
        }}
      />

      {/* Title */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 pointer-events-none">
        <span className="text-white font-absolution1 text-4xl drop-shadow-sm">
          {title}
        </span>
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-30 flex items-center justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                setIdx(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === idx ? "white" : "rgba(255,255,255,0.35)",
                transform: i === idx ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>
      )}
    </Link>
  );
}
