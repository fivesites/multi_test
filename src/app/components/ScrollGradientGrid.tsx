"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function ScrollGradientGrid() {
  const [scrollY, setScrollY] = useState(0);

  const word = ["M2", "M2", "M2", "M2", "M2", "M2"];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalRows = 10;
  const topCols = 8;
  const bottomStartCols = 4;
  const bottomEndCols = 1;
  const maxScroll = 1000;

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const scrollT = Math.min(scrollY / maxScroll, 1);

  return (
    <section
      style={{ height: `calc(${maxScroll}px + 100vh)`, position: "relative" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 flex flex-col bg-white">
          {Array.from({ length: totalRows }).map((_, rowIndex) => {
            const rowT = rowIndex / (totalRows - 1);
            const startCols = lerp(topCols, bottomStartCols, rowT);
            const endCols = lerp(topCols, bottomEndCols, rowT);
            const colsFloat = lerp(startCols, endCols, scrollT);
            const cols = Math.max(1, Math.round(colsFloat));

            return (
              <div
                key={rowIndex}
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                }}
              >
                {Array.from({ length: cols }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white  flex items-center justify-center"
                    style={{ aspectRatio: "1" }}
                  >
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="text-white text-xs font-monument  bg-black"
                    >
                      {word[(i + rowIndex) % word.length]}
                    </motion.p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
