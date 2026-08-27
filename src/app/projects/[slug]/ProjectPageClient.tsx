"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Lightbox from "@/app/components/Lightbox";
import WorkHeader from "@/app/components/WorkHeader";
import TypedWord from "@/app/components/TypedWord";

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
  "post-processing": "Post-prod",
  "post-production": "Post-prod",
  music: "Music Prod",
  "music-production": "Music Prod",
};

const TYPING_MS = 22;
const NAVIGATING_MS = 700;

function ProjectPageInner({
  client,
  title,
  year,
  description,
  credits,
  categories,
  images,
}: {
  client?: string;
  title: string;
  year?: number;
  description?: string;
  credits?: string;
  categories: string[];
  images: ProjectImage[];
}) {
  const clientLen = client?.length ?? 0;
  const titleLen = title.length;
  const yearLen = year?.toString().length ?? 0;
  const wTitleDelay = client ? (clientLen + 2) * TYPING_MS : 0;
  const wYearDelay = wTitleDelay + (titleLen + 2) * TYPING_MS;
  const wBackDelay = year
    ? wYearDelay + (yearLen + 2) * TYPING_MS
    : wTitleDelay + (titleLen + 2) * TYPING_MS;
  const revealDelayMs = NAVIGATING_MS + wBackDelay + (4 + 2) * TYPING_MS + 100;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), revealDelayMs);
    return () => clearTimeout(t);
  }, [revealDelayMs]);

  const [hero, ...rest] = images;

  return (
    <div className="relative px-6 pb-6">
      {/* WorkHeader hangs off this wrapper rather than off the title block: a
          sticky box can only travel inside its own parent, so it needs one that
          spans the hero and everything below it. */}
      <WorkHeader client={client} title={title} year={year} className="pt-0" />

      <div className=" h-[50dvh] bg-primary flex justify-start items-end p-6">
        <h1 className="  w-full  font-visual font-normal text-3xl lg:text-6xl tracking-normal uppercase  text-secondary-foreground leading-tight lg:leading-snug    ">
          <TypedWord text={title} visible={true} delay={0} />
        </h1>
      </div>

      {/* Hero: the first image fills the viewport */}
      {hero && (
        <div
          className="relative h-dvh w-full cursor-zoom-in overflow-hidden"
          onClick={() => setLightboxIndex(0)}
        >
          <Image
            src={hero.url}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      <motion.div
        className=" w-full relative pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Description — reached by scrolling past the hero */}
        <div className="flex flex-col justify-center items-start p-6">
          <div className="flex lg:grid lg:grid-cols-12 lg:mb-6 justify-start">
            <span className="lg:col-span-4">
              {description ? (
                <p className=" ">{description}</p>
              ) : (
                <p className="">
                  A bold visual concept rooted in craft and intention. Shot on
                  location, refined in post. Every frame built around a singular
                  idea — to make the ordinary feel inevitable.
                </p>
              )}
            </span>
          </div>
        </div>

        <div className="w-full">
          {/* Gallery */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-4 gap-3 w-full "
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
          >
            {rest.length === 0 ? (
              <>
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="relative aspect-square bg-lyx flex items-center justify-center font-visual text-lava uppercase tracking-widest text-sm lg:col-start-2 lg:col-span-2"
                  >
                    Placeholder
                  </div>
                ))}
              </>
            ) : (
              rest.map((img, i) => (
                <motion.div
                  key={img.key}
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  transition={{ duration: 0.2 }}
                  className="relative aspect-square cursor-zoom-in overflow-hidden lg:col-start-2 lg:col-span-2"
                  // +1: the hero is images[0]
                  onClick={() => setLightboxIndex(i + 1)}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* WORK FOOTER */}
        <div className="flex  flex-col justify-center items-start lg:grid-cols-4 w-full  lg:items-baseline ">
          <div className="flex flex-col col-span-2"></div>
          <h4 className="w-full  lg:justify-start whitespace-normal lg:whitespace-nowrap lg:items-baseline gap-x-0 gap-y-0 max-w-sm  mb-4">
            Services provided by Multi² in this project:
          </h4>

          {categories.map((c, i) => (
            <span className=" uppercase" key={c}>
              {i > 0 && ""}
              {CATEGORY_LABELS[c] ?? c}
            </span>
          ))}
          <div className="flex flex-col col-span-2">
            {credits && (
              <ul className=" col-span-2 list-none flex flex-col items-start justify-start ">
                {credits
                  .split("\n")
                  .filter(Boolean)
                  .map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
              </ul>
            )}
          </div>
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
      </motion.div>
    </div>
  );
}

export default function ProjectPageClient(props: {
  title: string;
  client?: string;
  slug: string;
  description?: string;
  credits?: string;
  categories: string[];
  year?: number;
  images: ProjectImage[];
}) {
  return <ProjectPageInner {...props} />;
}
