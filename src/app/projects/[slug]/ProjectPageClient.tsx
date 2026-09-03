"use client";

import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Lightbox from "@/app/components/Lightbox";
import LandningBlock from "@/app/components/LandningBlock";
import CheckButton from "@/app/components/CheckButton";

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
  images,
  coverUrl,
}: {
  client?: string;
  title: string;
  year?: number;
  description?: string;
  credits?: string;
  categories: string[];
  images: ProjectImage[];
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

  // The hero is the work's own cover image when it has one; otherwise it falls
  // back to the first media image, which then drops out of the gallery below.
  const hero: ProjectImage | undefined = coverUrl
    ? { key: "cover", url: coverUrl, aspectRatio: 1 }
    : images[0];
  const rest = coverUrl ? images : images.slice(1);
  const lightboxImages = coverUrl && hero ? [hero, ...images] : images;

  return (
    <div className="mt-16 lg:mt-24 pt-12 px-6 relative w-full ">
      <span className="grid grid-cols-3 lg:grid-cols-12 mb-6">
        <h2 className="h2Text col-start-2 lg:col-start-4 col-span-8 text-primary ">
          {title}
        </h2>
      </span>

      {/* Hero: the cover image fills the whole block, which spans the full 12
          columns. lg:px-6 + lg:col-start-4 put the title label at the same x as
          the nav's "sound off". */}
      <LandningBlock
        label={client}
        className="min-h-dvh  items-start w-full  lg:grid-cols-12 lg:px-0 "
        labelClassName="col-start-2 col-span-3 lg:col-start-4 lg:col-span-3 "
        background={
          hero ? (
            <div
              className="pixelCorners relative h-full w-full cursor-zoom-in"
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
          ) : undefined
        }
      />

      <span className="grid grid-cols-3 lg:grid-cols-12 w-full mb-12 lg:mb-12 text-primary">
        <h4 className="h4BtnText col-start-1 col-span-1 lg:col-start-4">
          fig.1
        </h4>
        <h4 className=" col-start-2 col-span-2 lg:col-start-6 lg:col-span-2 h4BtnText">
          {title}
        </h4>
      </span>

      <motion.div
        className=" w-full relative pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Description — reached by scrolling past the hero */}

        <div className="grid grid-cols-3 lg:grid-cols-12  mb-12 lg:mb-6 justify-start items-baseline text-primary">
          <span className="col-start-1 col-span-3 lg:col-start-4 lg:col-span-4 indent-[calc(33.3vw-1rem)] lg:indent-0  ">
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
              the description on mobile. */}
          {(categories.length > 0 || credits) && (
            <div className="col-start-1 col-span-3 lg:col-start-9 lg:col-span-4 mt-12 lg:mt-0 flex flex-col gap-y-6 text-primary">
              {categories.length > 0 && (
                <ul className="fgrid grid grid-cols-3 lg:grid-cols-2 gap-x-0 gap-y-6 items-baseline pText uppercase">
                  {categories.map((c) => (
                    <li key={c}>
                      <CheckButton
                        size="label"
                        active
                        label={CATEGORY_LABELS[c] ?? c}
                      />
                    </li>
                  ))}
                </ul>
              )}

              {credits && (
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 h4BtnText">
                  {credits
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => {
                      const { role, name } = parseCredit(line);
                      return (
                        <Fragment key={i}>
                          <dt className="uppercase text-muted-foreground">
                            {role}
                          </dt>
                          <dd className="m-0">{name}</dd>
                        </Fragment>
                      );
                    })}
                </dl>
              )}
            </div>
          )}
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
        </div>

        <AnimatePresence>
          {lightboxIndex !== null && (
            <Lightbox
              images={lightboxImages}
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
  coverUrl?: string;
}) {
  return <ProjectPageInner {...props} />;
}
