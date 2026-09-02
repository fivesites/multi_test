"use client";

import { usePixelCorners } from "@/app/hooks/usePixelCorners";

export default function ConnectPage() {
  const ref = usePixelCorners<HTMLButtonElement>();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <button
        ref={ref}
        className="pixelCorners bg-primary h3Text text-primary-foreground lg:text-xl w-full h-16 max-w-4xl"
      >
        connect
      </button>
    </div>
  );
}
