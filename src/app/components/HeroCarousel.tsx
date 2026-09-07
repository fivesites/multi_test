"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "./VideoPlayer";

type HeroMedia =
  | { type: "image"; key: string; url: string; aspectRatio: number }
  | { type: "video"; key: string; url: string };

/**
 * The project page hero: the work's media as a full-bleed carousel. Arrows sit
 * centred on the left and right edges; a "1 / 3" counter sits bottom-right.
 * Clicking a slide opens the lightbox at that index.
 */
export default function HeroCarousel({
  media,
  onOpen,
}: {
  media: HeroMedia[];
  onOpen: (index: number) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (media.length === 0) return null;

  return (
    <div className="pixelCorners relative h-full w-full">
      <div className="h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {media.map((item, i) => (
            <div
              key={item.key}
              className="relative flex-none w-full h-full cursor-zoom-in"
              onClick={() => onOpen(i)}
            >
              {item.type === "video" ? (
                <VideoPlayer src={item.url} className="h-full w-full" />
              ) : (
                <Image
                  src={item.url}
                  alt=""
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {media.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous"
            className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next"
            className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <span className="absolute bottom-3 lg:bottom-6 right-3 lg:right-6 z-10 h4BtnText text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            {selected + 1} / {media.length}
          </span>
        </>
      )}
    </div>
  );
}
