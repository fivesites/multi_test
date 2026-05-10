"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { UIProvider, useUI } from "@/context/UIContext";

import Lightbox from "@/app/components/Lightbox";
import { Button } from "@/components/ui/button";

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

function WorkPageInner({
  title,
  client,

  description,
  credits,
  categories,
  year,
  images,
}: {
  title: string;
  client?: string;

  description?: string;
  credits?: string;
  categories: string[];
  year?: number;
  images: ProjectImage[];
}) {
  const { glowMode } = useUI();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [heroImage, ...restImages] = images;

  return (
    <div className="min-h-screen bg-background lg:max-w-5xl">
      {/* Back button — fixed at same baseline as MultiNav Row 1 */}
      <div className="flex px-2 pt-2    items-baseline pointer-events-none">
        <Button
          variant={glowMode ? "glow" : "link"}
          className="font-rounded leading-tight pointer-events-auto"
          asChild
        >
          <Link href="/">Back</Link>
        </Button>
      </div>

      <div className="px-2 mt-16 ">
        {/* Header */}
        <div className="flex justify-between w-full lg:grid lg:grid-cols-4 items-baseline gap-8  mb-16">
          <h1 className="col-span-2 text-base font-rounded text-red-100 leading-tight [text-shadow:0_0_6px_#ef4444,0_0_16px_#ef4444,0_0_32px_#ef4444,0_0_60px_rgba(239,68,68,0.6)] [.no-glow_&]:text-red-500 [.no-glow_&]:[text-shadow:none]">
            {client && `${client} / `}
            {title}
          </h1>
          <h1 className="col-start-4 col-span-1 text-base font-rounded text-red-100 leading-tight [text-shadow:0_0_6px_#ef4444,0_0_16px_#ef4444,0_0_32px_#ef4444,0_0_60px_rgba(239,68,68,0.6)] [.no-glow_&]:text-red-500 [.no-glow_&]:[text-shadow:none]">
            {year && year}
          </h1>
        </div>

        {/* Description + credits */}
        {(description || credits) && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 mb-16">
            {description && (
              <p className="text-base col-span-2 max-w-sm font-rounded text-red-100 mb-16 leading-tight [text-shadow:0_0_6px_#ef4444,0_0_16px_#ef4444,0_0_32px_#ef4444,0_0_60px_rgba(239,68,68,0.6)] [.no-glow_&]:text-red-500 [.no-glow_&]:[text-shadow:none]">
                {description}
              </p>
            )}
            {credits && (
              <p
                className="text-base leading-tight font-rounded text-red-100 max-w-xs lg:max-w-xl [text-shadow:0_0_6px_#ef4444,0_0_16px_#ef4444,0_0_32px_#ef4444,0_0_60px_rgba(239,68,68,0.6)] [.no-glow_&]:text-red-500 [.no-glow_&]:[text-shadow:none]"
                style={{ whiteSpace: "pre-line" }}
              >
                {credits}
              </p>
            )}
          </div>
        )}
        <div className="flex flex-wrap justify-between w-full lg:grid lg:grid-cols-4 gap-x-8 gap-y-4 font-rounded text-base mb-16 text-red-100 leading-tight [text-shadow:0_0_6px_#ef4444,0_0_16px_#ef4444,0_0_32px_#ef4444,0_0_60px_rgba(239,68,68,0.6)] [.no-glow_&]:text-red-500 [.no-glow_&]:[text-shadow:none]">
          {categories.map((c, i) => (
            <span key={c}>
              {i > 0 && ""}
              {CATEGORY_LABELS[c] ?? c}
            </span>
          ))}
        </div>

        {/* Hero image */}
        {heroImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="relative w-full mb-2 cursor-zoom-in"
            style={{
              paddingBottom: `${(1 / (heroImage.aspectRatio || 1)) * 100}%`,
            }}
            onClick={() => setLightboxIndex(0)}
          >
            <Image
              src={heroImage.url}
              alt=""
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </motion.div>
        )}

        {/* Gallery */}
        {restImages.length > 0 && (
          <motion.div
            className="columns-2 md:columns-3 gap-2 pt-2"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
          >
            {restImages.map((img, i) => (
              <motion.div
                key={img.key}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                transition={{ duration: 0.2 }}
                className="relative break-inside-avoid mb-2 cursor-zoom-in"
                style={{
                  paddingBottom: `${(1 / (img.aspectRatio || 1)) * 100}%`,
                }}
                onClick={() => setLightboxIndex(i + 1)}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </motion.div>
            ))}
          </motion.div>
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
    </div>
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
  return (
    <UIProvider>
      <WorkPageInner {...props} />
    </UIProvider>
  );
}
