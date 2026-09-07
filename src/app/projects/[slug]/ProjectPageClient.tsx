"use client";

import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "motion/react";
import Lightbox from "@/app/components/Lightbox";
import LandningBlock from "@/app/components/LandningBlock";
import CheckButton from "@/app/components/CheckButton";
import HeroCarousel from "@/app/components/HeroCarousel";
import Footer from "@/app/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ProjectMedia =
  | { type: "image"; key: string; url: string; aspectRatio: number }
  | { type: "video"; key: string; url: string };

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

/** One credit line — "Creative Director: David Andersson" — split into its role
 *  and its name on the first `:` / `–` / `—`. A line with no delimiter is all
 *  role. */
function parseCredit(line: string): { role: string; name: string } {
  const match = line.match(/^(.*?)\s*[:–—]\s*(.*)$/);
  return match
    ? { role: match[1].trim(), name: match[2].trim() }
    : { role: line.trim(), name: "" };
}

function ProjectPageInner({
  client,
  title,
  year,
  description,
  credits,
  categories,
  media,
  coverUrl,
}: {
  client?: string;
  title: string;
  year?: number;
  description?: string;
  credits?: string;
  categories: string[];
  media: ProjectMedia[];
  coverUrl?: string;
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

  // The whole media list rides in the hero carousel; the cover image is the
  // fallback when a work has no media of its own yet.
  const slides: ProjectMedia[] =
    media.length > 0
      ? media
      : coverUrl
        ? [{ type: "image", key: "cover", url: coverUrl, aspectRatio: 1 }]
        : [];

  return (
    <div className="mt-16 lg:mt-24 pt-12 relative w-full px-0 ">
      <div className="grid grid-cols-3 lg:grid-cols-12 mb-6 items-baseline">
        {client && (
          <div className="col-start-1 col-span-1 lg:col-start-1 lg:col-span-3 flex px-0">
            <CheckButton size="lg" label={client} active />
          </div>
        )}
        <h2 className="h2Text col-start-2 lg:col-start-4 col-span-8 text-primary ">
          {title}
        </h2>
      </div>

      {/* Hero: the work's media as a full-bleed carousel spanning all 12
          columns; the title label sits in column one. */}
      <div className="relative px-3 w-full">
        <LandningBlock
          className="h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-3rem)] min-h-dvh  items-start w-full  lg:px-3 "
          labelClassName="col-start-1  col-span-3 px-3 lg:col-start-1 lg:col-span-3 "
          background={
            slides.length > 0 ? (
              <HeroCarousel media={slides} onOpen={setLightboxIndex} />
            ) : undefined
          }
        />
      </div>
      <motion.div
        className=" w-full relative pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Description — reached by scrolling past the hero */}

        <div className="grid grid-cols-3 lg:grid-cols-12  mb-12 lg:mb-6 justify-start items-baseline text-primary">
          <h4 className="h4BtnText  col-start-1 col-span-1 lg:col-start-1 px-3">
            fig.1
          </h4>
          <h4 className=" col-start-2 col-span-1 lg:col-start-2 lg:col-span-1 h4BtnText">
            moa larsson for {title}
          </h4>
          <span className="col-start-1 col-span-3 lg:col-start-4 lg:col-span-7 indent-[calc(33.3vw-1rem)] lg:indent-0 lowercase  mt-12  ">
            {description ? (
              <p className="pText  ">{description}</p>
            ) : (
              <p className="pText">
                A bold visual concept rooted in craft and intention. Shot on
                location, refined in post. Every frame built around a singular
                idea — to make the ordinary feel inevitable. A bold visual
                concept rooted in craft and intention. Shot on location, refined
                in post. Every frame built around a singular idea — to make the
                ordinary feel inevitable.
              </p>
            )}
          </span>

          {/* Categories then credits: from column 9 on desktop, stacked below
        

          {/* Credits: directly below the description, in the same column. */}
          {credits && (
            <dl className="col-start-1 col-span-3 lg:col-start-4 lg:col-span-6 mt-12 grid grid-cols-6 gap-x-3 gap-y-1 h4BtnText text-primary">
              {credits
                .split("\n")
                .filter(Boolean)
                .map((line, i) => {
                  const { role, name } = parseCredit(line);
                  return (
                    <Fragment key={i}>
                      <dt className="lowercase col-span-2">{role}</dt>
                      <dd className="m-0 col-span-1">{name}</dd>
                    </Fragment>
                  );
                })}
            </dl>
          )}
        </div>

        {categories.length > 0 && (
          <ul className="col-start-1 col-span-3 lg:col-start-1 lg:col-span-12 grid grid-cols-3 lg:grid-cols-12 gap-x-0 gap-y-6 items-baseline mt-12 lg:mt-24 mb-12  pText uppercase text-primary">
            {categories.map((c, i) => (
              <li
                key={c}
                className={cn(
                  "col-span-1 lg:col-span-2",
                  i === 0 && "lg:col-start-2",
                )}
              >
                <CheckButton
                  size="label"
                  active
                  label={CATEGORY_LABELS[c] ?? c}
                />
              </li>
            ))}
          </ul>
        )}

        <AnimatePresence>
          {lightboxIndex !== null && (
            <Lightbox
              media={slides}
              initialIndex={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <span className="grid grid-cols-3 lg:grid-cols-12 px-3 lg:px-6 mt-12 lg:mt-24 mb-12 lg:mb-24">
        <Button
          variant="link"
          size="lgLink"
          className=" col-start-1 lg:col-start-4 h2Text flex    gap-x-3  font-thin   justify-start w-min   "
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          top <span className="font-normal ">↑</span>
        </Button>
        <Button
          variant="link"
          size="lgLink"
          className=" col-start-3 lg:col-start-9 h2Text flex    gap-x-3  font-thin  justify-start w-min "
          asChild
        >
          <Link href="/projects">
            next <span className="font-normal ">→</span>
          </Link>
        </Button>
      </span>

      <Footer />
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
  media: ProjectMedia[];
  coverUrl?: string;
}) {
  return <ProjectPageInner {...props} />;
}
