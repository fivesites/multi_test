"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function VideoPlayer({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className={cn("object-cover", className)}
    />
  );
}
