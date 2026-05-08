"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type LightboxImage = { key: string; url: string; aspectRatio: number };

export default function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: initialIndex,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handler);
    };
  }, [emblaApi, onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-background"
      onClick={onClose}
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Close lightbox"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="h-5 w-5" />
      </Button>

      <div
        className="w-full h-dvh overflow-hidden"
        ref={emblaRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full">
          {images.map((img) => (
            <div
              key={img.key}
              className="flex-none w-full h-full flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-contain object-top"
                  sizes="100vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              scrollPrev();
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              scrollNext();
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </motion.div>,
    document.body,
  );
}
