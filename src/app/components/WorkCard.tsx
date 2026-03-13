"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Slide = { type: "image"; url: string } | { type: "video"; url: string };

const CATEGORY_LABELS: Record<string, string> = {
  photo: "Photo",
  video: "Video",
  production: "Production",
  "art-direction": "Art Direction",
  concept: "Concept",
};

export function WorkCard({
  title,
  client,
  categories,
  slug,
  slides,
  className,
}: {
  title: string;
  client?: string;
  categories?: string[];
  slug: string;
  backgroundColor?: string;
  slides: Slide[];
  className?: string;
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
      className={cn(
        "relative block overflow-hidden group bg-black",
        className ?? "h-[90vh]",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Media slides — unblurred, blur on hover */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          filter: hovered ? "blur(12px)" : "blur(0px)",
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}
      >
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
                sizes="(max-width: 768px) 50vw, 25vw"
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
      </div>

      {/* Title — bottom left, visible by default, fades on hover */}
      <div
        className="absolute bottom-4 left-4 z-20 pointer-events-none transition-all duration-500"
        style={{
          opacity: hovered ? 0 : 1,
          filter: hovered ? "blur(8px)" : "blur(0px)",
        }}
      >
        <Button variant="ghost" size="lg" tabIndex={-1}>
          {title}
        </Button>
      </div>

      {/* Hover info — top left: title, client, categories */}
      <div
        className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1 transition-all duration-500 font-rounded font-normal text-xl text-white"
        style={{
          opacity: hovered ? 1 : 0,
          filter: hovered ? "blur(0px)" : "blur(8px)",
        }}
      >
        <span className="">{title}</span>
        {client && <span className="">{client}</span>}
        {categories && categories.length > 0 && (
          <span className="font-mono text-sm mt-2">
            {categories.map((cat) => CATEGORY_LABELS[cat] ?? cat).join(", ")}
          </span>
        )}
      </div>
    </Link>
  );
}
