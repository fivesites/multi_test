"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import MultiCard from "./MultiCard";
import ShowreelSlideshow from "./ShowreelSlideshow";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const RED_SHADES = [
  "#fef2f2",
  "#fee2e2",
  "#fecaca",
  "#fca5a5",
  "#f87171",
  "#ef4444",
  "#dc2626",
  "#b91c1c",
  "#991b1b",
  "#7f1d1d",
];

function redShadeForKey(key: string) {
  const idx =
    key.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    RED_SHADES.length;
  return RED_SHADES[idx];
}

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
  const [view, setView] = useState<null | "showreel" | "projects">("showreel");
  const [active, setActive] = useState("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(true);
  const [loadPhase, setLoadPhase] = useState<"loading" | "done">("loading");
  const [loaderKey, setLoaderKey] = useState(0);

  function restartLoader() {
    setLoaderKey((k) => k + 1);
    setLoadPhase("loading");
  }

  const openCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openSlug && openCardRef.current) {
      openCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [openSlug]);

  function toggleView(v: "showreel" | "projects") {
    setView((current) => (current === v ? null : v));
    if (v === "projects") restartLoader();
  }

  const slugsSeen = new Set<string>();
  const displayed = (
    active === "all"
      ? items.filter((i) => i.isPrimary)
      : items.filter((i) => i.categories.includes(active))
  ).filter((i) => {
    if (slugsSeen.has(i.slug)) return false;
    slugsSeen.add(i.slug);
    return true;
  });

  const showreelImages = items
    .filter((i) => i.isPrimary)
    .slice(0, 3)
    .map((i) => ({ key: i.key, url: i.url, aspectRatio: i.aspectRatio }));

  function handleFilterChange(cat: string) {
    setView("projects");
    setActive(cat);
    setOpenSlug(null);
    restartLoader();
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-row justify-between w-full font-rounded text-2xl text-red-200 px-2 pt-1 items-baseline">
        <Button
          variant="link"
          className="font-rounded text-2xl tracking-wider gap-0 text-red-500 hover:text-red-500"
          onClick={() => setShowAbout(!showAbout)}
        >
          Multi <span className="font-ft88-gothique text-base ml-0">2</span>
        </Button>
        <div className="flex-1 mx-2 h-5 self-center bg-red-100 overflow-hidden rounded-full">
          <motion.div
            key={loaderKey}
            className="h-full bg-red-500 rounded-full"
            initial={{ width: "0%", opacity: 1 }}
            animate={
              loadPhase === "loading"
                ? { width: "100%", opacity: 1 }
                : { width: "100%", opacity: 0 }
            }
            transition={
              loadPhase === "loading"
                ? { duration: 1.5, ease: [0.4, 0, 0.2, 1] }
                : { duration: 0.4 }
            }
            onAnimationComplete={() => {
              if (loadPhase === "loading") setLoadPhase("done");
            }}
          />
        </div>
        <div className="flex items-baseline">
          <Button
            variant="link"
            className={cn(
              "font-rounded",
              view === "showreel" && "text-red-600",
            )}
            onClick={() => toggleView("showreel")}
          >
            Showreel
          </Button>
          ,
          <Button
            variant="link"
            className={cn(
              "font-rounded ml-1",
              view === "projects" && "text-red-600 font-medium",
            )}
            onClick={() => toggleView("projects")}
          >
            Projects
          </Button>
          ,
          <Button variant="link" className="ml-1">
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
              variant="link"
              onClick={() => handleFilterChange(cat)}
              className={cn(
                "font-rounded inline px-0",
                view === "projects" &&
                  active === cat &&
                  "text-red-600 font-medium",
                view !== "projects" && "opacity-50",
              )}
            >
              {cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
            </Button>
            {i !== categories.length && ","}{" "}
          </span>
        ))}
        {/* <Button variant="link">Search...</Button> */}
      </div>
      {view === "showreel" && (
        <div className="px-2 pt-2 max-w-xl">
          <ShowreelSlideshow images={showreelImages} />
        </div>
      )}
      {view === "projects" && (
        <>
          {/* Masonry grid — CSS columns */}
          <div className="columns-2 md:columns-3 gap-2 px-2 pt-2 ">
            <AnimatePresence mode="popLayout" initial={false}>
              {displayed.map((item) => {
                const isOpen = item.slug === openSlug;

                if (isOpen) {
                  return (
                    <motion.div
                      ref={openCardRef}
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
                    <div className="absolute inset-0">
                      <Image
                        src={item.url}
                        alt={item.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 group-hover:opacity-0 transition-opacity duration-300 flex items-center justify-center pointer-events-none bg-red-500">
                        <div className="flex gap-0 items-center justify-center text-red-100">
                          <span className=" font-rounded text-2xl">M</span>
                          <span className="font-ft88-gothique text-base">
                            2
                          </span>
                        </div>
                      </div>
                    </div>
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
