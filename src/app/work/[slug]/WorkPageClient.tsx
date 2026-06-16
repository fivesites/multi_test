"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Lightbox from "@/app/components/Lightbox";

type ProjectImage = { key: string; url: string; aspectRatio: number };

const CATEGORY_LABELS: Record<string, string> = {
  photo: "Photo",
  video: "Video",
  production: "Production",
  "art-direction": "Art Direction",
  concept: "Concept",
  "sound-design": "Sound Design",
  vax: "Vax",
  dop: "DOP",
  "post-processing": "Post-processing",
};

const formatCredit = (line: string) =>
  CATEGORY_LABELS[line.trim()] ??
  line.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const TYPING_MS = 22;
const NAVIGATING_MS = 700;

function WorkPageInner({
  client,
  title,
  year,
  description,
  credits,
  categories,
  images,
}: {
  client?: string;
  title: string;
  year?: number;
  description?: string;
  credits?: string;
  categories: string[];
  images: ProjectImage[];
}) {
  const clientLen = client?.length ?? 0;
  const titleLen = title.length;
  const yearLen = year?.toString().length ?? 0;
  const wTitleDelay = client ? (clientLen + 2) * TYPING_MS : 0;
  const wYearDelay = wTitleDelay + (titleLen + 2) * TYPING_MS;
  const wBackDelay = year
    ? wYearDelay + (yearLen + 2) * TYPING_MS
    : wTitleDelay + (titleLen + 2) * TYPING_MS;
  const revealDelayMs = NAVIGATING_MS + wBackDelay + (4 + 2) * TYPING_MS + 100;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), revealDelayMs);
    return () => clearTimeout(t);
  }, [revealDelayMs]);

  return (
    <motion.div
      className="bg-background dark:bg-lader w-full relative pb-4"
      style={{ paddingTop: "var(--nav-height)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: revealed ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Client / description / credits */}
      <div className="flex flex-col justify-center items-start lg:items-start px-8 lg:px-8 pb-0 h-[50dvh] lg:h-auto">
        <h1 className="h1ProjectHeader flex flex-wrap justify-center whitespace-break-spaces mt-0 lg:mt-2 mb-4  gap-x-1">
          {client}
        </h1>
        <div className="flex lg:grid lg:grid-cols-6 lg:mb-4 mb-4  justify-start ">
          <span className="lg:col-span-4">
            {description ? (
              <p className="pText ">{description}</p>
            ) : (
              <p className="pText">
                A bold visual concept rooted in craft and intention. Shot on
                location, refined in post. Every frame built around a singular
                idea — to make the ordinary feel inevitable.
              </p>
            )}
          </span>
        </div>
      </div>

      <div className="max-w-7xl">
        {/* Gallery */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-4 gap-2 pt-2 px-2.5 lg:px-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
        >
          {images.length === 0 ? (
            <>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="relative aspect-square bg-lyx flex items-center justify-center font-visual text-lava uppercase tracking-widest text-sm"
                >
                  Placeholder
                </div>
              ))}
            </>
          ) : (
            images.map((img, i) => (
              <motion.div
                key={img.key}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                transition={{ duration: 0.2 }}
                className="relative aspect-square cursor-zoom-in overflow-hidden"
                onClick={() => setLightboxIndex(i)}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* WORK FOOTER */}
      <div className="flex  flex-col justify-center items-start lg:grid-cols-4 px-8 w-full pt-8 pb-8 text-lava font-visual text-2xl lg:text-2xl lg:items-baseline">
        <h4 className="w-full col-span-3 font-visual text-2xl lg:text-2xl leading-tight text-left lg:text-left font-normal tracking-normal lg:tracking-normal lg:leading-[1] lg:justify-start whitespace-normal lg:items-baseline gap-x-0 gap-y-0 max-w-sm text-lava mb-4">
          Services provided by Multi² in this project:
        </h4>

        {categories.map((c, i) => (
          <span
            className="uppercase font-normal text-2xl tracking-normal text-lava"
            key={c}
          >
            {i > 0 && ""}
            {CATEGORY_LABELS[c] ?? c}
          </span>
        ))}

        {credits && (
          <ul className="font-visual text-2xl tracking-normal font-normal leading-[1.2] mt-16 text-left text-lava list-none flex flex-col items-start justify-start">
            {credits
              .split("\n")
              .filter(Boolean)
              .map((line, i) => (
                <li key={i}>{line}</li>
              ))}
          </ul>
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function WorkPageClient(props: {
  title: string;
  client?: string;
  slug: string;
  description?: string;
  credits?: string;
  categories: string[];
  year?: number;
  images: ProjectImage[];
}) {
  return <WorkPageInner {...props} />;
}
