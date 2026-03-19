"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useScroll, useTransform, motion } from "framer-motion";
import MultiText from "./MultiText";

type HeroWork = { label: string; slug: string; coverImageUrl: string };

function HeroCell({
  works,
  offset,
  priority,
}: {
  works: HeroWork[];
  offset: number;
  priority?: boolean;
}) {
  const [idx, setIdx] = useState(offset % Math.max(works.length, 1));
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered || works.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % works.length), 500);
    return () => clearInterval(id);
  }, [hovered, works.length]);

  return (
    <div
      className="relative overflow-hidden h-full w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {works.map((work, i) => (
        <Image
          key={work.coverImageUrl}
          src={work.coverImageUrl}
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
      <div
        className="absolute inset-0 bg-primary/30 mix-blend-multiply pointer-events-none transition-opacity duration-700"
        style={{ opacity: hovered ? 0 : 1 }}
      />
      {works[idx]?.slug && (
        <div
          className="absolute inset-0 z-10 flex items-start justify-start p-0 transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <Button variant="default" size="default" asChild>
            <Link href={`/work/${works[idx].slug}`}>{works[idx].label}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function MobileHero({ works }: { works: HeroWork[] }) {
  return (
    <div className="lg:hidden grid grid-cols-1">
      <div className="relative bg-primary h-[50vh] flex items-center justify-center">
        <MultiText className="text-primary-foreground" />
      </div>
      <div className="h-[50vh]">
        <HeroCell works={works} offset={0} priority />
      </div>
    </div>
  );
}

function DesktopHero({ works }: { works: HeroWork[] }) {
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
            <HeroCell works={works} offset={0} priority />
          </div>

          <motion.div
            className="relative z-10 bg-primary h-full flex items-center justify-center origin-center"
            style={{ scale: middleScale }}
          >
            <motion.div style={{ scale: textScale }}>
              <MultiText className="text-primary-foreground" />
            </motion.div>
          </motion.div>

          <div className="h-full">
            <HeroCell works={works} offset={1} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeHero({ works = [] }: { works?: HeroWork[] }) {
  return (
    <section className="snap-start w-full">
      <MobileHero works={works} />
      <DesktopHero works={works} />
    </section>
  );
}
