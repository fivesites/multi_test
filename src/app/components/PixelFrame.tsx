"use client";

import Image, { type ImageProps } from "next/image";
import { usePixelCorners } from "@/app/hooks/usePixelCorners";
import { cn } from "@/lib/utils";

type Props = ImageProps & {
  /** Sizing for the frame: aspect ratio, width, margins — whatever the layout
   *  needs. The image fills it. */
  className?: string;
  /** Passed to the inner <Image>; defaults to `object-cover`. */
  imageClassName?: string;
};

/**
 * An image in a pixel-notched box — the same corner treatment the buttons and
 * landing blocks get. The `.pixelCorners` mask and `overflow-hidden` sit on the
 * frame, so the picture is clipped to the notched shape. Give the frame its
 * size (an aspect ratio or explicit dimensions); the `fill` image takes the
 * rest.
 */
export default function PixelFrame({
  className,
  imageClassName,
  alt,
  ...image
}: Props) {
  const ref = usePixelCorners<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn("pixelCorners relative overflow-hidden", className)}
    >
      <Image
        alt={alt}
        fill
        className={cn("object-cover", imageClassName)}
        {...image}
      />
    </div>
  );
}
