"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import MultiCard from "./MultiCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

export type GridItem = {
  key: string;
  url: string;
  alt: string;
  slug: string;
  title: string;
  client?: string;
  categories: string[];
  aspectRatio: number;
  isPrimary: boolean;
  projectImages: { key: string; url: string; aspectRatio: number }[];
};

export default function DemoClient({
  items,
  categories,
}: {
  items: GridItem[];
  categories: string[];
}) {
  const [active, setActive] = useState("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const displayed =
    active === "all"
      ? items.filter((i) => i.isPrimary)
      : items.filter((i) => i.categories.includes(active));

  function handleFilterChange(cat: string) {
    setActive(cat);
    setOpenSlug(null);
  }

  return (
    <div className="min-h-screen">
      {/* Filter bar */}
      <Button variant="glow"> Multi2 </Button>
      <div className="flex flex-wrap gap-x-0 gap-y-2">
        {["all", ...categories].map((cat) => (
          <Button
            key={cat}
            variant={active === cat ? "glow" : "link"}
            onClick={() => handleFilterChange(cat)}
            className={cn(
              "font-rounded transition-colors",
              active !== cat &&
                "text-foreground/40 hover:text-foreground no-underline hover:no-underline",
            )}
          >
            {cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
          </Button>
        ))}
      </div>

      {/* Masonry grid — CSS columns */}
      <div className="columns-2 md:columns-3 gap-2 mt-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {displayed.map((item) => {
            const isOpen = item.slug === openSlug;

            if (isOpen) {
              return (
                <motion.div
                  key={`card-${item.slug}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ columnSpan: "all" } as React.CSSProperties}
                  className="mb-2"
                >
                  <MultiCard
                    title={item.title}
                    client={item.client}
                    categories={item.categories}
                    slug={item.slug}
                    projectImages={item.projectImages}
                    thumbKey={`thumb-${item.key}`}
                    onClose={() => setOpenSlug(null)}
                  />
                </motion.div>
              );
            }

            return (
              <motion.div
                key={item.key}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative break-inside-avoid mb-2 cursor-pointer group"
                style={{ paddingBottom: `${(1 / item.aspectRatio) * 100}%` }}
                onClick={() => setOpenSlug(item.slug)}
              >
                <motion.div
                  layoutId={`thumb-${item.key}`}
                  className="absolute inset-0"
                >
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-70"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
