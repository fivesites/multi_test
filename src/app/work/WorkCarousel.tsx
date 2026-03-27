"use client";

import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useMotionValue, animate, motion } from "motion/react";
import { WorkCard } from "@/app/components/WorkCard";

type WorkCardData = {
  _id: string;
  title: string;
  slug: string;
  backgroundColor?: string;
  slides: { type: "image" | "video"; url: string }[];
};

export function WorkCarousel({ works }: { works: WorkCardData[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stretchX = useMotionValue(1);

  function advance() {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    animate(stretchX, [1, 0.45, 1], {
      duration: 1.0,
      times: [0, 0.28, 1],
      ease: ["easeIn", [0.22, 1.4, 0.36, 1]],
    });
  }

  function startAutoplay() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, 5000);
  }

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    startAutoplay();

    return () => {
      emblaApi.off("select", onSelect);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi]);

  function onPointerDown() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function onPointerUp() {
    startAutoplay();
  }

  return (
    <div
      className="relative"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {works.map((work) => (
            <div key={work._id} className="flex-none w-full overflow-hidden">
              <motion.div style={{ scaleX: stretchX, transformOrigin: "center center" }}>
                <WorkCard
                  title={work.title}
                  slug={work.slug}
                  backgroundColor={work.backgroundColor}
                  slides={work.slides}
                  className="h-screen"
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {works.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "bg-white scale-125"
                : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to case ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
