"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import PixelShaderOverlay from "../components/PixelShaderOverlay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DemoNavbar from "./DemoNavbar";

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

  // "All" = one image per project; category = all images from matching projects
  const displayed =
    active === "all"
      ? items.filter((i) => i.isPrimary)
      : items.filter((i) => i.categories.includes(active));

  return (
    <div className="min-h-screen">
      {/* Filter bar */}
      <DemoNavbar />
      <div className="flex flex-wrap gap-x-0 gap-y-2">
        {["all", ...categories].map((cat) => (
          <Button
            key={cat}
            variant={active === cat ? "glow" : "link"}
            onClick={() => setActive(cat)}
            className={cn(
              "font-rounded  transition-colors",
              active !== cat &&
                "text-foreground/40 hover:text-foreground no-underline hover:no-underline",
            )}
          >
            {cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
          </Button>
        ))}
      </div>

      {/* Grid — each cell sizes to its own aspect ratio */}
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {displayed.map((item) => (
            <motion.div
              key={item.key}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ aspectRatio: item.aspectRatio }}
              className="relative"
            >
              <Link
                href={`/work/${item.slug}`}
                className="group block w-full h-full "
              >
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  className="object-contain transition-opacity duration-300 group-hover:opacity-70"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
