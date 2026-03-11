"use client";
import { useWindowSize } from "@/app/hooks/useWindowSize";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

export default function M2GradientGrid() {
  const { width, height } = useWindowSize();

  const word = ["M", "U", "L", "T", "I", "S", "Q", "U", "A", "R", "E", "D"];
  const totalRows = word.length;
  const topCols = 4;
  const bottomStartCols = 6;
  const bottomEndCols = 6;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const [gradientProgress, setGradientProgress] = useState(0);
  const currentStep = Math.floor(gradientProgress * word.length);
  const directionRef = useRef(1);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);
  const duration = 4000;

  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const delta = time - lastTimeRef.current;

        setGradientProgress((prev) => {
          let next = prev + (delta / duration) * directionRef.current;
          if (next >= 1) {
            next = 1;
            directionRef.current = -1;
          } else if (next <= 0) {
            next = 0;
            directionRef.current = 1;
          }
          return next;
        });
      }

      lastTimeRef.current = time;
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <section style={{ height: `${height}px`, position: "relative" }}>
      <div className="absolute inset-0 flex flex-col bg-black overflow-hidden">
        {Array.from({ length: totalRows }).map((_, rowIndex) => {
          const rowT = rowIndex / (totalRows - 1);
          const startCols = lerp(topCols, bottomStartCols, rowT);
          const endCols = lerp(topCols, bottomEndCols, rowT);
          const colsFloat = lerp(startCols, endCols, gradientProgress);
          const cols = Math.max(1, Math.round(colsFloat));
          const cellSize = width / cols;

          return (
            <div
              key={rowIndex}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
                height: `${cellSize}px`,
              }}
            >
              {Array.from({ length: cols }).map((_, i) => (
                <motion.p
                  key={i}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-white text-xs font-monument flex items-center aspect-square justify-center"
                  style={{ width: cellSize, height: cellSize }}
                >
                  {word[(i + rowIndex + currentStep) % word.length]}
                </motion.p>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
