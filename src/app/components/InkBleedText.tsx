"use client";

import * as React from "react";

interface InkBleedTextProps {
  children?: React.ReactNode;
  text?: string;
  duration?: number; // ms
  endBlur?: number;
  static?: boolean;
  className?: string;
}

export default function InkBleedText({
  children,
  text,
  duration = 800,
  endBlur = 0.8,
  static: isStatic = false,
  className,
}: InkBleedTextProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (isStatic) {
      el.style.filter = `blur(${endBlur}px)`;
      el.style.opacity = "1";
      return;
    }

    const start = performance.now();
    const startBlur = 12;

    function frame(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const blur = startBlur - eased * (startBlur - endBlur);
      const opacity = Math.pow(eased, 0.4);
      el!.style.filter = `blur(${blur}px)`;
      el!.style.opacity = String(opacity);
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }, [duration, isStatic]);

  return (
    <>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="ink-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
      <div style={{ filter: "url(#ink-threshold)" }}>
        <div ref={wrapperRef} style={{ opacity: 0 }} className={className}>
          {children ?? text}
        </div>
      </div>
    </>
  );
}
