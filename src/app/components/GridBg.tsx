"use client";

import { useEffect, useRef } from "react";

const WORD = "MULTISQUARED";
const COLS = WORD.length; // 12
const ROWS = 24;
const TOTAL = COLS * ROWS;
const SWEEP = 2400;
const HOLD = 1000;
const CYCLE = SWEEP * 2 + HOLD * 2;

function getChar(idx: number, elapsed: number): string {
  const t = elapsed % CYCLE;
  const threshold = (idx / TOTAL) * SWEEP;
  const letter = WORD[idx % COLS];

  if (t < SWEEP) {
    return t > threshold ? letter : "M²";
  }
  if (t < SWEEP + HOLD) {
    return letter;
  }
  if (t < SWEEP * 2 + HOLD) {
    return t - SWEEP - HOLD > threshold ? "M²" : letter;
  }
  return "M²";
}

export default function GridBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<string[]>(Array(TOTAL).fill("M²"));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cells = Array.from(container.children) as HTMLElement[];
    const start = performance.now();
    let rafId: number;

    const frame = (now: number) => {
      const elapsed = now - start;
      cells.forEach((cell, idx) => {
        const next = getChar(idx, elapsed);
        if (stateRef.current[idx] !== next) {
          stateRef.current[idx] = next;
          cell.textContent = next;
        }
      });
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden t flex flex-wrap content-start gap-[9px] p-[9px] lg:gap-[12px] lg:p-[12px] bg-blue-600 dark:bg-black z-0 "
    >
      {Array.from({ length: TOTAL }).map((_, i) => (
        <div
          key={i}
          className="w-[87px] h-[87px] lg:w-[131px] lg:h-[131px] flex-shrink-0 flex items-start justify-start font-rounded text-[9px]  lg:text-[12px] line-height-[9px] lg:line-height-[12px] p-[3px] lg:p-[6px] tracking-wide text-neutral-200 border"
        >
          M²
        </div>
      ))}
    </div>
  );
}
