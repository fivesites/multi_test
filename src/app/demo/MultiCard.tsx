"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Lightbox from "./Lightbox";

type ProjectImage = { key: string; url: string; aspectRatio: number };

export default function MultiCard({
  title,
  client,
  slug,
  projectImages,
  onClose,
}: {
  title: string;
  client?: string;
  categories?: string[];
  slug: string;
  projectImages: ProjectImage[];
  onClose: () => void;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <Card className="w-full text-red-600 rounded-none">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-0">
          <div className="flex flex-col gap-0">
            <p className="text-2xl font-rounded leading-tight">
              {client ?? title}, 2024
            </p>
          </div>
          <div className="flex items-center gap-0 shrink-0">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/work/${slug}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close"
              onClick={onClose}
              className="text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-2xl leading-tight font-rounded max-w-3xl mb-2">
            Multi² is not your typical company. It&apos;s a multiplier. This is the
            story of Adam and Daniel who found each other through a shared
            multidisciplinary mindset. Together, they don&apos;t just double the
            output — they multiply it, exponentially. From global brands like
            IKEA to bold collaborations with Jureskog and ATG, we help brands
            move faster, think clearer, and create more with less.
          </p>

          <motion.div
            className="columns-2 gap-2"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {projectImages.map((img, i) => (
              <motion.div
                key={img.key}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.3 }}
                className="relative break-inside-avoid mb-2 cursor-zoom-in"
                style={{ paddingBottom: `${(1 / (img.aspectRatio || 1)) * 100}%` }}
                onClick={() => setLightboxIndex(i)}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
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
