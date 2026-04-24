"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";
import { AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ImageCarousel from "./ImageCarousel";
import Lightbox from "./Lightbox";

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

type ProjectImage = { key: string; url: string; aspectRatio: number };

export default function MultiCard({
  title,
  client,
  categories,
  slug,
  projectImages,
  thumbKey,
  onClose,
}: {
  title: string;
  client?: string;
  categories: string[];
  slug: string;
  projectImages: ProjectImage[];
  thumbKey: string;
  onClose: () => void;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
          <div className="flex flex-col gap-2">
            <p className="text-xl font-semibold leading-tight">
              {client ?? title}
            </p>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <Badge key={cat} variant="secondary">
                  {CATEGORY_LABELS[cat] ?? cat}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/work/${slug}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ImageCarousel
            images={projectImages}
            thumbKey={thumbKey}
            onImageClick={setLightboxIndex}
          />
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
