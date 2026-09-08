"use client";

import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import LandningBlock from "@/app/components/LandningBlock";
import CheckButton from "@/app/components/CheckButton";
import HeroCarousel from "@/app/components/HeroCarousel";
import VideoPlayer from "@/app/components/VideoPlayer";
import ProjectsNav from "@/app/components/ProjectsNav";
import Footer from "@/app/components/Footer";

export type ProjectMedia =
  | {
      type: "image";
      key: string;
      url: string;
      aspectRatio: number;
      description?: string;
    }
  | { type: "video"; key: string; url: string; description?: string };

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

  const [revealed, setRevealed] = useState(false);
  // Which carousel slide is showing — drives the caption below the hero.
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), revealDelayMs);
    return () => clearTimeout(t);
  }, [revealDelayMs]);

  // The hero is a single still (or the first video): the cover image, falling
  // back to the first media item.
  const hero: ProjectMedia | undefined =
    media.find((m) => m.type === "video") ??
    (coverUrl
      ? { type: "image", key: "cover", url: coverUrl, aspectRatio: 1 }
      : media[0]);

  // The gallery carousel further down runs the whole media list; the cover is
  // the fallback when a work has no media of its own yet.
  const slides: ProjectMedia[] =
    media.length > 0
      ? media
      : coverUrl
        ? [{ type: "image", key: "cover", url: coverUrl, aspectRatio: 1 }]
        : [];

  return (
    <div className=" relative w-full px-0 mt-24 ">
      <div className="grid grid-cols-3 lg:grid-cols-12 mb-3 lg:mb-0 items-baseline">
        {client && (
          <div className="hidden lg:flex col-start-1 col-span-1 lg:col-start-1 lg:col-span-3  px-0">
            <CheckButton size="lg" label={client} active />
          </div>
        )}
        <h2 className="h2Text col-start-2 lg:col-start-4 col-span-3 lg:col-span-8 text-primary lowercase lg:px-3 ">
          {title}
        </h2>
      </div>

      {/* Hero: a single still filling the block, which spans all 12 columns. */}
      <div className="relative px-0 w-full">
        <LandningBlock
          className="h-dvh  items-start w-full  lg:px-3 "
          labelClassName="col-start-1  col-span-3 px-3 lg:col-start-1 lg:col-span-3 "
          background={
            hero ? (
              <div className=" relative h-full w-full">
                {hero.type === "video" ? (
                  <VideoPlayer src={hero.url} className="h-full w-full" />
                ) : (
                  <Image
                    src={hero.url}
                    alt=""
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                  />
                )}
              </div>
            ) : undefined
          }
        />
      </div>

      {/* Description + credits — reached by scrolling past the hero. */}
      <motion.div
        className=" w-full relative pb-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="grid grid-cols-3 lg:grid-cols-12 gap-y-12 mb-12 lg:mb-6 items-start text-primary">
          <div className="col-start-1 col-span-3 lg:col-start-4 lg:col-span-8 flex flex-col gap-y-6 px-3 lg:px-0 lowercase">
            {description ? (
              <p className="pText">{description}</p>
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
          </div>

          <dl className="col-start-1 col-span-3 lg:col-start-4 lg:col-span-8 grid grid-cols-[auto_1fr] lg:grid-cols-8 gap-x-6 gap-y-2 px-3 lg:px-0 h4BtnText lowercase text-primary">
            <dt className="text-primary/50 lg:col-span-2">project</dt>
            <dd className="m-0 lg:col-span-6">{title}</dd>
            {client && (
              <>
                <dt className="text-primary/50 lg:col-span-2">client</dt>
                <dd className="m-0 lg:col-span-6">{client}</dd>
              </>
            )}
            {year && (
              <>
                <dt className="text-primary/50 lg:col-span-2">year</dt>
                <dd className="m-0 lg:col-span-6">{year}</dd>
              </>
            )}
            {categories.length > 0 && (
              <>
                <dt className="text-primary/50 lg:col-span-2">categories</dt>
                <dd className="m-0 lg:col-span-6 flex flex-col">
                  {categories.map((c) => (
                    <span key={c}>{CATEGORY_LABELS[c] ?? c}</span>
                  ))}
                </dd>
              </>
            )}
            {credits && (
              <>
                <dt className="text-primary/50 lg:col-span-2">credits</dt>
                <dd className="m-0 lg:col-span-6 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                  {credits
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => {
                      const { role, name } = parseCredit(line);
                      return (
                        <Fragment key={i}>
                          <span className="text-primary/50 col-span-2">
                            {role}
                          </span>
                          <span>{name}</span>
                        </Fragment>
                      );
                    })}
                </dd>
              </>
            )}
          </dl>
        </div>
      </motion.div>

      {/* Gallery: the work's media as a carousel, with the figure caption
          directly below it. */}

      {slides.length > 0 && (
        <div className="w-full px-3 grid grid-cols-3 lg:grid-cols-12">
          <div className="col-start-1 col-span-3 lg:col-span-8 relative h-[70dvh] lg:h-[80dvh] w-full">
            <HeroCarousel
              media={slides}
              selected={activeSlide}
              onSelect={setActiveSlide}
            />
          </div>

          <div className="mt-6 lg:mt-0col-start-1 lg:col-start-9 col-span-3 ">
            <h4 className="col-start-1 col-span-3 lg:col-start-4 lg:col-span-8 h4BtnText grid grid-cols-3 gap-x-2 lowercase text-primary">
              <span className="col-span-1 pl-6">fig.{activeSlide + 1}</span>
              <span className="col-span-2 pr-6">
                {slides[activeSlide]?.description ?? `moa larsson for ${title}`}
              </span>
            </h4>
          </div>
        </div>
      )}

      <div className="w-full mb-6 mt-24">
        <ProjectsNav />
      </div>

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
