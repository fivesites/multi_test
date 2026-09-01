"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useSound } from "@/context/SoundContext";
import { cn } from "@/lib/utils";

const STEP = 0.05;

/**
 * A bar that fills from the left edge to the right as the level rises. The
 * fill width is a percentage motion value, so it reaches both edges exactly
 * and needs no measuring — only the pointer maths reads the track's rect.
 */
export default function VolumeSlider({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  const { volume, setVolume } = useSound();
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const pct = useMotionValue(volume * 100);
  const width = useTransform(pct, (v) => `${v}%`);
  // Clips the second copy of the amount to exactly the filled portion.
  const clip = useTransform(pct, (v) => `inset(0 ${100 - v}% 0 0)`);

  // Follow the level when something else moves it (mute, keys), but never
  // fight the pointer mid-drag.
  useEffect(() => {
    if (!draggingRef.current) pct.set(volume * 100);
  }, [volume, pct]);

  /** Pointer position → level, for both the initial press and the drag. */
  function apply(clientX: number) {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const next = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    pct.set(next * 100);
    setVolume(next);
  }

  const amount = Math.round(volume * 100);

  return (
    <div className={cn("flex items-center gap-x-3 w-full", className)}>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={label ?? "Volume"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={amount}
        // Capture keeps the drag alive once the pointer leaves the bar, so
        // sliding past either end still tracks instead of sticking.
        onPointerDown={(e) => {
          draggingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          apply(e.clientX);
        }}
        onPointerMove={(e) => {
          if (draggingRef.current) apply(e.clientX);
        }}
        onPointerUp={() => {
          draggingRef.current = false;
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            setVolume(volume + STEP);
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            setVolume(volume - STEP);
          }
        }}
        className="relative h-6 w-full flex-1 cursor-pointer touch-none overflow-hidden bg-secondary select-none border"
      >
        <motion.div
          aria-hidden
          style={{ width }}
          className="absolute inset-y-0 left-0 bg-primary"
        />
        {/* The amount sits over both halves of the bar, so it is drawn twice:
            once in the unfilled colour, then again clipped to the fill. */}
        <span className="absolute inset-0 flex items-center justify-center font-visual text-xs text-primary tabular-nums">
          {amount}
        </span>
        <motion.span
          aria-hidden
          style={{ clipPath: clip }}
          className="absolute inset-0 flex items-center justify-center font-visual text-[0.5rem] text-primary-foreground tabular-nums"
        >
          {amount}
        </motion.span>
      </div>
      {label ? (
        <span className="shrink-0 font-visual text-xs text-primary lowercase pr-3">
          {label}
        </span>
      ) : null}
    </div>
  );
}
