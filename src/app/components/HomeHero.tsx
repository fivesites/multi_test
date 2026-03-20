"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import MultiText from "./MultiText";

type HeroImage = { label: string; slug: string; url: string };

function HeroCell({
  images,
  offset,
  priority,
}: {
  images: HeroImage[];
  offset: number;
  priority?: boolean;
}) {
  const [idx, setIdx] = useState(offset % Math.max(images.length, 1));

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % images.length), 500);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative overflow-hidden h-full w-full">
      {images.map((img, i) => (
        <Image
          key={img.url}
          src={img.url}
          alt=""
          fill
          sizes="33vw"
          className="object-cover"
          style={{
            opacity: i === idx ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
          priority={priority && i === 0}
        />
      ))}
    </div>
  );
}

function MobileHero({ images }: { images: HeroImage[] }) {
  return (
    <div className="lg:hidden h-screen">
      <HeroCell images={images.length > 0 ? images : []} offset={0} priority />
    </div>
  );
}

function DesktopHero({ images }: { images: HeroImage[] }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const middleScale = useTransform(scrollYProgress, [0, 1], [1, 3.5]);
  const textScale = useTransform(middleScale, (s) => 1 / s);

  return (
    <div ref={containerRef} className="hidden lg:block h-[250vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="grid grid-cols-3 h-full">
          <div className="h-full">
            <HeroCell images={images} offset={0} priority />
          </div>

          {/* CENTER: bg-primary + MultiText — scales on scroll */}
          <motion.div
            className="relative z-10 bg-primary h-full flex items-center justify-center origin-center"
            style={{ scale: middleScale }}
          >
            <motion.div style={{ scale: textScale }}>
              <MultiText className="text-primary-foreground" />
            </motion.div>
          </motion.div>

          <div className="h-full">
            <HeroCell images={images} offset={1} />
          </div>
        </div>
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
      <MobileHero images={mobileImages.length > 0 ? mobileImages : portraitImages} />
      <DesktopHero images={portraitImages} />
    </section>
  );
}
