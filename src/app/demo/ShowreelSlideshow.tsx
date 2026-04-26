"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

type SlideImage = { key: string; url: string; aspectRatio: number };

export default function ShowreelSlideshow({ images }: { images: SlideImage[] }) {
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
  const tinyW = 16;
  const tinyH = Math.round(16 / (current.aspectRatio || 1));

  return (
    <div
      className="relative w-full overflow-hidden"
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
          {/* Full-res layer */}
          <Image
            src={current.url}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 85vw"
          />
          {/* Pixelated overlay — fades out as slide settles */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={current.url}
              alt=""
              width={tinyW}
              height={tinyH}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ imageRendering: "pixelated" }}
              aria-hidden={true}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
