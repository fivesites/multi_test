"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import MultiCard from "./MultiCard";
import ShowreelSlideshow from "./ShowreelSlideshow";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

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
  const [view, setView] = useState<null | "showreel" | "projects">(null);
  const [active, setActive] = useState("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(true);

  function toggleView(v: "showreel" | "projects") {
    setView((current) => (current === v ? null : v));
  }

  const displayed =
    active === "all"
      ? items.filter((i) => i.isPrimary)
      : items.filter((i) => i.categories.includes(active));

  const showreelImages = items
    .filter((i) => i.isPrimary)
    .slice(0, 3)
    .map((i) => ({ key: i.key, url: i.url, aspectRatio: i.aspectRatio }));

  function handleFilterChange(cat: string) {
    setActive(cat);
    setOpenSlug(null);
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-row justify-between w-full lg:justify-start lg:gap-x-16 font-rounded text-2xl text-red-200 px-2 pt-1 items-baseline">
        <Button
          variant={showAbout ? "glow" : "link"}
          className={cn(
            "font-rounded  text-2xl tracking-wider gap-0 transition-colors",
            !showAbout &&
              "text-red-200 hover:text-red-500 no-underline hover:no-underline",
          )}
          onClick={() => setShowAbout(!showAbout)}
        >
          Multi <span className="font-ft88-gothique text-base ml-0">2</span>
        </Button>
        <div className="flex items-baseline">
          <Button
            variant={view === "showreel" ? "glow" : "link"}
            className={cn(
              "font-rounded transition-colors",
              view !== "showreel" &&
                "text-red-200 hover:text-red-500 no-underline hover:no-underline",
            )}
            onClick={() => toggleView("showreel")}
          >
            Showreel
          </Button>
          ,
          <Button
            variant={view === "projects" ? "glow" : "link"}
            className={cn(
              "font-rounded transition-colors ml-1",
              view !== "projects" &&
                "text-red-200 hover:text-red-500 no-underline hover:no-underline",
            )}
            onClick={() => toggleView("projects")}
          >
            Projects
          </Button>
          ,
          <Button
            variant="link"
            className="ml-1 text-red-200 hover:text-red-500 no-underline hover:no-underline"
          >
            Connect
          </Button>
        </div>
      </div>
      {!showAbout && (
        <div className="absolute z-[50] top-2 left-2 px-2 pt-1 pb-2 text-2xl font-rounded leading-none mt-8 bg-red-600 max-w-4xl shadow">
          <p className="text-2xl leading-tight text-background">
            Multi² is not your typical company. It&apos;s a multiplier. This is
            the story of Adam and Daniel who found each other through a shared
            multidisciplinary mindset. Together, they don&apos;t just double the
            output — they multiply it, exponentially. From global brands like
            IKEA to bold collaborations with Jureskog and ATG, we help brands
            move faster, think clearer, and create more with less.
          </p>
          <button
            className="absolute top-2 right-2 cursor-pointer text-background leading-none"
            onClick={() => setShowAbout(true)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="px-2 text-2xl font-rounded text-red-200 leading-none">
        {["all", ...categories].map((cat, i) => (
          <span key={cat}>
            <Button
              variant={view === "projects" && active === cat ? "glow" : "link"}
              onClick={
                view === "projects" ? () => handleFilterChange(cat) : undefined
              }
              className={cn(
                "font-rounded transition-colors inline px-0",
                (view !== "projects" || active !== cat) &&
                  "text-red-200 hover:text-red-500 no-underline hover:no-underline",
                view !== "projects" && "pointer-events-none opacity-50",
              )}
            >
              {cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
            </Button>
            {i !== categories.length && ","}{" "}
          </span>
        ))}
      </div>
      {view === "showreel" && (
        <div className="px-2 pt-2">
          <ShowreelSlideshow images={showreelImages} />
        </div>
      )}
      {view === "projects" && (
        <>
          {/* Masonry grid — CSS columns */}
          <div className="columns-2 md:columns-3 gap-2 px-2 pt-1">
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
                    style={{
                      paddingBottom: `${(1 / item.aspectRatio) * 100}%`,
                    }}
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
        </>
      )}
    </div>
  );
}
