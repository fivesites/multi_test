"use client";

import { useState } from "react";

import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Lightbox from "./Lightbox";
import TextBlock from "./TextBlock";

type ProjectImage = { key: string; url: string; aspectRatio: number };

export default function MultiCard({
  title,
  client,
  credits,

  projectImages,
  onClose,
}: {
  title: string;
  client?: string;
  credits?: string;
  categories?: string[];
  slug: string;
  projectImages: ProjectImage[];
  onClose: () => void;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const placeholderText =
    "Multi² is not your typical company. It's a multiplier. This is the story of Adam and Daniel who found each other through a shared multidisciplinary mindset. Together, they don't just double the output — they multiply it, exponentially. From global brands like IKEA to bold collaborations with Jureskog and ATG, we help brands move faster, think clearer, and create more with less.";

  return (
    <>
      <Card className="w-full text-red-500 rounded-none bg-red-950 pb-0 ">
        <CardHeader className="flex flex-row items-baseline justify-between gap-4 px-4 pt-4 pb-4 ">
          <div className="flex flex-col gap-0">
            <p className="text-2xl font-rounded leading-tight  ">
              {client ?? title}, 2024
            </p>
          </div>
          <div className="flex items-center gap-0 shrink-0">
            <Button
              variant="link"
              size="icon"
              aria-label="Close"
              onClick={onClose}
              className="text-red-4400 "
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4 px-4">
            <TextBlock text={placeholderText} />

            <p className="hidden lg:block text-2xl leading-tight font-rounded max-w-3xl ">
              {credits}
            </p>
          </div>

          <motion.div
            className="columns-2 gap-2 pt-2 px-0 bg-background"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {projectImages.map((img, i) => (
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
                onClick={() => setLightboxIndex(i)}
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
        </CardContent>
      </Card>

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
