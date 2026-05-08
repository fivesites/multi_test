"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

type SlideImage = { key: string; url: string; aspectRatio: number };

export default function ShowreelSlideshow({
  images,
}: {
  images: SlideImage[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  const current = images[index];
  if (!current) return null;

  const containerAspectRatio = images[0]?.aspectRatio || 16 / 9;

  return (
    <div
      className="relative w-full overflow-hidden group"
      style={{ paddingBottom: `${(1 / containerAspectRatio) * 100}%` }}
    >
      <AnimatePresence>
        <motion.div
          key={current.key}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={current.url}
            alt=""
            fill
            className="object-contain object-center lg:object-top"
            sizes="(max-width: 768px) 100vw, 85vw"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
