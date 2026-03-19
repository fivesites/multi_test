"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Slide = { type: "image"; url: string } | { type: "video"; url: string };

export function WorkCard({
  client,
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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [slides.length]);

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
        "relative flex items-start justify-start overflow-hidden group bg-black w-full",
        className ?? "h-[90vh]",
      )}
    >
      {/* Media slides */}
      <div className="absolute inset-0">
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
                sizes="(max-width: 1024px) 100vw, 33vw"
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

      {/* Client name */}
      {client && (
        <div className="relative z-20 pointer-events-none w-full p-0 flex justify-center lg:justify-start">
          <Button
            className="w-full lg:w-min group-hover:bg-background group-hover:text-foreground"
            variant="default"
            size="default"
            tabIndex={-1}
          >
            {client}
          </Button>
        </div>
      )}
    </Link>
  );
}
