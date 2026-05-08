"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const GLOW =
  "0 0 6px #ef4444, 0 0 16px #ef4444, 0 0 32px #ef4444, 0 0 60px rgba(239,68,68,0.6)";

type Item = { x: number; y: number; rotate: number; opacity: number; scale: number };

function generate(count: number): Item[] {
  return Array.from({ length: count }, () => {
    const r = Math.sqrt(Math.random()) * 0.68;
    const theta = Math.random() * Math.PI * 2;
    return {
      x: 50 + r * 50 * Math.cos(theta),
      y: 50 + r * 50 * Math.sin(theta),
      rotate: (Math.random() - 0.5) * 140,
      opacity: 0.25 + Math.random() * 0.75,
      scale: 0.5 + Math.random() * 1.0,
    };
  });
}

export default function TextDrop({
  text,
  className,
  count = 24,
  active = false,
}: {
  text: string;
  className?: string;
  count?: number;
  active?: boolean;
}) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setItems(generate(count));
  }, [count]);

  return (
    <div className={cn("relative rounded-full", className)}>
      {items.map((item, i) => (
        <span
          key={i}
          className="absolute font-rounded leading-none select-none pointer-events-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotate}deg) scale(${item.scale})`,
            opacity: item.opacity,
            textShadow: active ? GLOW : undefined,
          }}
        >
          {text}
        </span>
      ))}
    </div>
  );
}
