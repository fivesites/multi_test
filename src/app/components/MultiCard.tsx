"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Lightbox from "./Lightbox";
import { cn } from "@/lib/utils";
import { useUI } from "@/context/UIContext";

type ProjectImage = { key: string; url: string; aspectRatio: number };

export default function MultiCard({
  title,
  client,
  slug,
  description,
  projectImages,
  onClose,
}: {
  title: string;
  client?: string;
  slug: string;
  description?: string;
  credits?: unknown;
  categories?: string[];
  projectImages: ProjectImage[];
  onClose: () => void;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [heroImage] = projectImages;
  const { showList } = useUI();

  return (
    <>
      <div className="relative">
        <Card className="w-full text-red-500 pb-4 rounded-xl  ">
          {!showList && (
            <CardHeader className="flex flex-row items-baseline justify-between gap-4 px-0 pt-4 pb-0">
              <Button variant="link" className=" px-0" asChild>
                <Link href={`/projects/${slug}`}>
                  {client && `${client} / `}
                  {title}
                </Link>
              </Button>

              <Button
                variant="link"
                aria-label="Close"
                onClick={onClose}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
          )}

          <Link href={`/projects/${slug}`}>
            <CardContent className="pt-0 px-0 flex flex-col">
              <p className="text-xl   lg:text-lg font-visual max-w-sm lg:max-w-lg text-red-500 leading-tight ">
                {description ??
                  "This is a description text. Not a manifesto, not a pitch deck, and definitely not the usual agency talk. It's about a small team with an oversized obsession for clarity, motion, and ideas that stick. "}
              </p>
              <CardAction className="flex justify-start gap-1 w-full mb-4">
                <Button
                  variant="link"
                  className={cn(" leading-tight px-0 mt-0 rounded-md")}
                >
                  Go to project
                </Button>
                <Button variant="link">,</Button>
                <Button variant="link" className=" leading-tight px-0 mt-0 ">
                  Close
                </Button>
              </CardAction>
              {heroImage && showList && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="relative w-full max-w-1/2 lg:max-w-1/4 aspect-square cursor-zoom-in  overflow-hidden"
                >
                  <Image
                    src={heroImage.url}
                    alt=""
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              )}
            </CardContent>
          </Link>
        </Card>
      </div>

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
