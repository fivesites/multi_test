"use client";

import { cn } from "@/lib/utils";

export default function VideoPlayer({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className={cn("object-cover", className)}
    />
  );
}
