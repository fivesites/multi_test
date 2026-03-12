"use client";

import { useEffect, useRef } from "react";

type Note = { _id: string; text: string };

export function PhilosophyTicker({ notes }: { notes: Note[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!trackRef.current) return;
      trackRef.current.style.transform = `translateX(-${window.scrollY * 0.4}px)`;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Repeat enough to cover the scroll range
  const track = [...notes, ...notes, ...notes];

  return (
    <div className="overflow-hidden ">
      <div ref={trackRef} className="flex w-max will-change-transform">
        {track.map((note, i) => (
          <div
            key={i}
            className="flex-none w-[50vw] md:w-[33vw] lg:w-[25vw] aspect-square flex items-center justify-center p-8"
            style={{
              backgroundColor:
                i % 2 === 0
                  ? "var(--secondary)"
                  : "var(--secondary-foreground)",
              color:
                i % 2 === 0
                  ? "var(--secondary-foreground)"
                  : "var(--secondary)",
            }}
          >
            <p className="text-center text-sm font-mono leading-tight">
              {note.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
