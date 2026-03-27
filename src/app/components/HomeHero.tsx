"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, animate } from "motion/react";
import MultiText from "./MultiText";

type HeroImage = { label: string; slug: string; url: string };

const INTERVAL = 3500;
const DURATION = 2;
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

function OverlaySlide({
  scale,
  image,
}: {
  scale: ReturnType<typeof useMotionValue<number>>;
  image: HeroImage;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ scale, transformOrigin: "left bottom" }}
    >
      <Image
        src={image.url}
        alt={image.label}
        fill
        sizes="100vw"
        className="object-cover"
      />
    </motion.div>
  );
}

/** Must be placed inside a `relative` positioned parent — fills it via `absolute inset-0`. */
function ImageCarousel({ images }: { images: HeroImage[] }) {
  const baseRef = useRef(0);
  const [base, setBase] = useState(0);
  const [overlay, setOverlay] = useState<number | null>(null);
  const busy = useRef(false);
  const scale = useMotionValue(0);

  useEffect(() => {
    if (overlay === null) return;
    scale.set(0);
    const stop = animate(scale, 1, {
      duration: DURATION,
      ease: EASE,
      onComplete: () => {
        baseRef.current = overlay;
        setBase(overlay);
        setOverlay(null);
        busy.current = false;
      },
    });
    return () => stop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlay]);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      if (busy.current) return;
      busy.current = true;
      const next = (baseRef.current + 1) % images.length;
      setOverlay(next);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base — always fully visible */}
      <div className="absolute inset-0">
        <Image
          src={images[base].url}
          alt={images[base].label}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay — reveals left→right over the base */}
      {overlay !== null && (
        <OverlaySlide scale={scale} image={images[overlay]} />
      )}
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
  const mobile = mobileImages.length > 0 ? mobileImages : portraitImages;

  return (
    <section className="snap-start w-full">
      {/* Mobile */}
      <div className="lg:hidden h-screen relative">
        <ImageCarousel images={mobile} />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none " />
        <div className="absolute bottom-8 left-8 z-20 pointer-events-none">
          <MultiText className="text-white" frozenFull />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block h-screen relative">
        <ImageCarousel images={portraitImages} />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 backdrop-blur-sm to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-8 left-8 z-20 pointer-events-none">
          <MultiText className="text-white" frozenFull />
        </div>
      </div>
    </section>
  );
}
