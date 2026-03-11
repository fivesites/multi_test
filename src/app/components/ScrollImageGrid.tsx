"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";

const images = ["/multi_note_yellow 1.png", "/multi_notes_pink 1.png"];

export default function ScrollImageGrid() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const maxScroll = 800;
  const totalRows = 30;

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const scrollT = Math.min(scrollY / maxScroll, 1);

  // 👇 Animate columns from 16 → 4
  const colsFloat = lerp(16, 4, scrollT);
  const cols = Math.round(colsFloat);

  // subtle overall scale to enhance zoom feeling
  const gridScale = lerp(1, 1.2, scrollT);

  return (
    <section
      style={{ height: `calc(${maxScroll}px + 100vh)` }}
      className="relative z-50 w-full"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center w-full">
        <motion.div
          className="grid gap-0"
          style={{
            width: "100%",
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            transform: `scale(${gridScale})`,
          }}
        >
          {Array.from({ length: totalRows }).map((_, rowIndex) =>
            Array.from({ length: cols }).map((_, colIndex) => {
              const isEven = (rowIndex + colIndex) % 2 === 0;
              const imgSrc = isEven ? images[0] : images[1];

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="relative aspect-square overflow-hidden"
                >
                  <Image
                    src={imgSrc}
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              );
            }),
          )}
        </motion.div>
      </div>
    </section>
  );
}
