"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useMotionValue, animate, motion } from "motion/react";
import MultiText from "./MultiText";

type HeroImage = { label: string; slug: string; url: string };

function useStretchCarousel(interval: number) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const stretchX = useMotionValue(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function advance() {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    // Stretch out quickly, spring back elastically
    // Compress inward quickly, spring-release back — veryes.co style
    animate(stretchX, [1, 0.7, 1], {
      duration: 1.0,
      times: [0, 0.28, 1],
      ease: ["easeIn", [0.22, 1.4, 0.36, 1]],
    });
  }

  function startAutoplay() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, interval);
  }

  useEffect(() => {
    if (!emblaApi) return;
    startAutoplay();
    return () => {
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

  return { emblaRef, stretchX, onPointerDown, onPointerUp };
}

function MobileHero({ images }: { images: HeroImage[] }) {
  const { emblaRef, stretchX, onPointerDown, onPointerUp } =
    useStretchCarousel(4000);

  if (images.length === 0)
    return <div className="lg:hidden h-screen bg-muted" />;

  return (
    <div
      className="lg:hidden h-screen"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((img) => (
            <div
              key={img.url}
              className="flex-none w-full h-full overflow-hidden"
            >
              <motion.div
                className="relative w-full h-full"
                style={{ scaleX: stretchX, transformOrigin: "center center" }}
              >
                <Image
                  src={img.url}
                  alt={img.label}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesktopHero({ images }: { images: HeroImage[] }) {
  const { emblaRef, stretchX, onPointerDown, onPointerUp } =
    useStretchCarousel(4000);

  if (images.length === 0)
    return <div className="hidden lg:block h-screen bg-muted" />;

  return (
    <div
      className="hidden lg:block h-screen relative"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((img) => (
            <div
              key={img.url}
              className="flex-none w-full h-full overflow-hidden"
            >
              <motion.div
                className="relative w-full h-full"
                style={{ scaleX: stretchX, transformOrigin: "center center" }}
              >
                <Image
                  src={img.url}
                  alt={img.label}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Agency name overlay */}
      <div className="absolute bottom-8 left-8 z-10 pointer-events-none scale-[2] origin-bottom-left ">
        <MultiText className="text-white" frozenFull />
      </div>
    </div>
  );
}

export default function HomeHero({
  portraitImages = [],
  mobileImages = [],
}: {
  portraitImages?: HeroImage[];
  mobileImages?: HeroImage[];
}) {
  return (
    <section className="snap-start w-full">
      <MobileHero
        images={mobileImages.length > 0 ? mobileImages : portraitImages}
      />
      <DesktopHero images={portraitImages} />
    </section>
  );
}
