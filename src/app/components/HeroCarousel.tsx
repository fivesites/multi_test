"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import VideoPlayer from "./VideoPlayer";
import CheckButton from "./CheckButton";

type HeroMedia =
  | {
      type: "image";
      key: string;
      url: string;
      aspectRatio: number;
      description?: string;
    }
  | { type: "video"; key: string; url: string; description?: string };

/**
 * The project page hero: the work's media as a carousel. Each item is shown
 * whole (`object-contain`, padded) — the same treatment the lightbox gave it.
 * Prev/next are CheckButtons pinned to the vertical centre of each edge; a
 * "1 / 3" counter sits bottom-right. `onSelect` reports the current index so the
 * page can show that item's caption.
 */
export default function HeroCarousel({
  media,
  selected,
  onSelect,
}: {
  media: HeroMedia[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const sync = () => onSelect(emblaApi.selectedScrollSnap());
    sync();
    emblaApi.on("select", sync);
    return () => {
      emblaApi.off("select", sync);
    };
  }, [emblaApi, onSelect]);

  if (media.length === 0) return null;

  return (
    <div className="border border-primary relative h-full w-full ">
      <div className="h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {media.map((item, i) => (
            <div
              key={item.key}
              className="flex-none w-full h-full flex items-center justify-center"
            >
              <div className="relative h-full w-full">
                {item.type === "video" ? (
                  <VideoPlayer
                    src={item.url}
                    controls
                    className="object-contain"
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    priority={i === 0}
                    className="object-contain object-center"
                    sizes="100vw"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {media.length > 1 && (
        <>
          <div className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-10">
            <CheckButton
              onClick={scrollPrev}
              label="previous"
              markOnly
              marks={{ active: "←", inactive: "←" }}
              size="label"
              className="text-primary"
            />
          </div>

          <div className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-10">
            <CheckButton
              onClick={scrollNext}
              label="next"
              markOnly
              marks={{ active: "→", inactive: "→" }}
              size="label"
              className="text-primary"
            />
          </div>

          <span className="absolute bottom-3 lg:bottom-6 right-3 lg:right-6 z-10 h4BtnText text-primary">
            {selected + 1} / {media.length}
          </span>
        </>
      )}
    </div>
  );
}
