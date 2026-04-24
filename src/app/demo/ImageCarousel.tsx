"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CarouselImage = { key: string; url: string; aspectRatio: number };

export default function ImageCarousel({
  images,
  thumbKey,
  onImageClick,
}: {
  images: CarouselImage[];
  thumbKey?: string;
  onImageClick: (index: number) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2">
          {images.map((img, i) => {
            const slideWidth = `${img.aspectRatio * 60}vh`;

            return (
              <div
                key={img.key}
                className="flex-none cursor-zoom-in"
                style={{ width: slideWidth, maxWidth: "85vw" }}
                onClick={() => onImageClick(i)}
              >
                {i === 0 && thumbKey ? (
                  <motion.div
                    layoutId={thumbKey}
                    className="relative w-full"
                    style={{
                      paddingBottom: `${(1 / img.aspectRatio) * 100}%`,
                    }}
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="85vw"
                    />
                  </motion.div>
                ) : (
                  <div
                    className="relative w-full"
                    style={{
                      paddingBottom: `${(1 / img.aspectRatio) * 100}%`,
                    }}
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="85vw"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous image"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/80"
            onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next image"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/80"
            onClick={(e) => { e.stopPropagation(); scrollNext(); }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
