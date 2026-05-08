"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Lightbox from "./Lightbox";

type ProjectImage = { key: string; url: string; aspectRatio: number };

type PortableTextBlock = {
  _type: string;
  children?: { text?: string }[];
};

function resolveCredits(credits: unknown): string | null {
  if (!credits) return null;
  if (typeof credits === "string") return credits;
  if (Array.isArray(credits)) {
    return credits
      .map((block: PortableTextBlock) =>
        (block.children ?? []).map((c) => c.text ?? "").join(""),
      )
      .filter(Boolean)
      .join("\n");
  }
  return null;
}

const DESCRIPTION =
  "This is a description text. Not a manifesto, not a pitch deck, and definitely not the usual agency talk. It's about a small team with an oversized obsession for clarity, motion, and ideas that stick. We blend strategy, design, and technology into systems that feel as sharp as they look. From emerging brands to established names, we create experiences that cut through noise, shift perception, and turn complexity into something people actually remember.";

export default function MultiCard({
  title,
  client,
  credits,
  projectImages,
  onClose,
}: {
  title: string;
  client?: string;
  credits?: unknown;
  categories?: string[];
  slug: string;
  projectImages: ProjectImage[];
  onClose: () => void;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const creditsText = resolveCredits(credits);
  const [heroImage, ...restImages] = projectImages;

  const descriptionAndCredits = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4 px-4">
      <p className="text-2xl col-span-2 font-rounded text-red-100 leading-tight [text-shadow:0_0_6px_#ef4444,0_0_16px_#ef4444,0_0_32px_#ef4444,0_0_60px_rgba(239,68,68,0.6)] [.no-glow_&]:text-red-500 [.no-glow_&]:[text-shadow:none]">
        {DESCRIPTION}
      </p>
      {creditsText && (
        <p
          className="text-base leading-tight font-rounded text-red-100 [text-shadow:0_0_6px_#ef4444,0_0_16px_#ef4444,0_0_32px_#ef4444,0_0_60px_rgba(239,68,68,0.6)] [.no-glow_&]:text-red-500 [.no-glow_&]:[text-shadow:none]"
          style={{ whiteSpace: "pre-line" }}
        >
          {creditsText}
        </p>
      )}
    </div>
  );

  const imageGallery = (
    <>
      {heroImage && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full px-4 mb-2 cursor-zoom-in"
          style={{
            paddingBottom: `calc(${(1 / (heroImage.aspectRatio || 1)) * 100}% + 1rem)`,
          }}
          onClick={() => setLightboxIndex(0)}
        >
          <Image
            src={heroImage.url}
            alt=""
            fill
            className="object-contain px-4"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </motion.div>
      )}
      {restImages.length > 0 && (
        <motion.div
          className="columns-2 md:columns-3 gap-2 pt-0 px-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {restImages.map((img, i) => (
            <motion.div
              key={img.key}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
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
    </>
  );

  return (
    <>
      {/* Normal card */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-[18px] bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[18px] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        <Card className="w-full text-red-500 bg-background pb-4">
          <CardHeader className="flex flex-row items-baseline justify-between gap-4 px-4 pt-4 pb-4">
            <div className="flex flex-col gap-0">
              <Button
                variant="glow"
                className="text-2xl font-rounded leading-tight flex items-center"
              >
                {title}
              </Button>
            </div>
            <div className="flex items-center gap-0 shrink-0">
              <Button
                variant="glow"
                size="icon"
                aria-label="Fullscreen"
                onClick={() => setFullscreen(true)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="glow"
                size="icon"
                aria-label="Close"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {descriptionAndCredits}
            {imageGallery}
          </CardContent>
        </Card>
      </div>

      {/* Fullscreen overlay — portaled to body to escape ancestor stacking contexts */}
      {mounted &&
        fullscreen &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-background overflow-y-auto"
          >
            <div className="max-w-5xl mx-auto">
              <Card className="w-full text-red-500 bg-background pb-4 border-0 shadow-none">
                <CardHeader className="flex flex-row items-baseline justify-between gap-4 px-4 pt-4 pb-4">
                  <div className="flex flex-col gap-0">
                    <Button
                      variant="glow"
                      className="text-2xl font-rounded leading-tight flex items-center"
                    >
                      {client} / {title}
                    </Button>
                  </div>
                  <div className="flex items-center gap-0 shrink-0">
                    <Button
                      variant="glow"
                      size="icon"
                      aria-label="Exit fullscreen"
                      onClick={() => setFullscreen(false)}
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="glow"
                      size="icon"
                      aria-label="Close"
                      onClick={onClose}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {descriptionAndCredits}
                  {imageGallery}
                </CardContent>
              </Card>
            </div>
          </motion.div>,
          document.body,
        )}

      {/* Lightbox — rendered last so it sits above fullscreen at same z-level */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={projectImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
