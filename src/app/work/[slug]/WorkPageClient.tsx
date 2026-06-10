"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { UIProvider } from "@/context/UIContext";
import Lightbox from "@/app/components/Lightbox";
import { Button } from "@/components/ui/button";

type ProjectImage = { key: string; url: string; aspectRatio: number };

const PALETTE = [
  "text-lyx",
  "text-lax",
  "text-lava",
  "text-lappar",
  "text-liguriskt",
  "text-lader",
];

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

function WorkPageInner({
  title,
  client,

  description,
  credits,
  categories,
  year,
  images,
}: {
  title: string;
  client?: string;

  description?: string;
  credits?: string;
  categories: string[];
  year?: number;
  images: ProjectImage[];
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [heroImage, ...restImages] = images;

  return (
    <div className=" bg-background w-full">
      {/* Mobile: 3-col, no commas */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 pt-2 w-full grid grid-cols-3 items-start lg:hidden">
        <Button
          variant="link"
          className={`font-visual text-sm font-medium tracking-wide ${PALETTE[0]} leading-tight uppercase px-0`}
          asChild
        >
          <Link href="/">Back</Link>
        </Button>
        <span
          className={`font-visual text-sm font-medium tracking-wide ${PALETTE[2]} leading-tight uppercase text-center`}
        >
          {title}
        </span>
        <span
          className={`font-visual text-sm font-medium tracking-wide ${PALETTE[3]} leading-tight text-right`}
        >
          {year}
        </span>
      </div>

      {/* Desktop: flex-col — Back on top, client/title/year row below */}
      <div className="absolute top-0 left-0 right-0 z-10 px-8 pt-8 w-full hidden lg:flex flex-col items-start">
        <Button
          variant="link"
          className={`font-visual text-lg font-medium tracking-wide ${PALETTE[0]} leading-tight uppercase`}
          asChild
        >
          <Link href="/">Back</Link>
        </Button>
        <div className="flex items-baseline">
          {client && (
            <span
              className={`font-visual text-lg font-medium tracking-wide ${PALETTE[1]} leading-tight`}
            >
              {client}{", "}
            </span>
          )}
          <span
            className={`font-visual text-lg font-medium tracking-wide ${PALETTE[2]} leading-tight uppercase`}
          >
            {title}{year && ", "}
          </span>
          {year && (
            <span
              className={`font-visual text-lg font-medium tracking-wide ${PALETTE[3]} leading-tight`}
            >
              {year}
            </span>
          )}
        </div>
      </div>

      <div className=" h-[calc(100dvh-4rem)] lg:h-auto lg:pt-[45vh] flex flex-col justify-center items-center lg:items-start px-4 lg:px-8">
        {/* Header */}
        <h1 className="font-visual text-5xl lg:text-5xl uppercase leading-none text-center lg:text-left text-liguriskt font-normal tracking-tight lg:tracking-tighter lg:leading-[0.9] flex flex-wrap justify-center whitespace-break-spaces items-baseline gap-x-1">
          {client}
          <svg
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-9 h-9"
          >
            <rect
              width="300"
              height="300"
              transform="matrix(-1 0 0 1 300 0)"
              className="fill-lyx"
            />
            <path
              d="M112 111V30H94.153L78.0331 67.3757C77.3423 68.9957 76.6514 69.8057 75.5 69.8057C74.1183 69.8057 73.5426 69.2271 72.7366 67.3757L56.7319 30H39V111H51.7808V52.2171H56.2713V61.2429H60.7618V74.4343H65.2524V83.46H85.7476V74.4343H90.2382V61.2429H94.7287V52.2171H99.2192V111H112Z"
              className="fill-liguriskt"
            />
          </svg>
        </h1>
        <div className="flex lg:grid lg:grid-cols-4   lg:mb-8">
          <span className="lg:col-span-3 ">
            {description ? (
              <p className="font-visual text-2xl lg:text-2xl lg: tracking-normal max-w-5xl font-medium leading-[1.1] mt-1 text-center text-liguriskt lg:text-left lg:font-normal lg:indent-16 ">
                {description}
              </p>
            ) : (
              <p className="font-visual text-2xl lg:text-2xl lg:tracking-normal max-w-3xl font-medium leading-[1.1] mt-1 text-center text-liguriskt lg:text-left lg:font-normal lg:indent-16">
                A bold visual concept rooted in craft and intention. Shot on
                location, refined in post. Every frame built around a singular
                idea — to make the ordinary feel inevitable.
              </p>
            )}
          </span>
          <span className="hidden lg:block lg:col-span-1 ">
            {credits && (
              <p className="font-visual text-sm  tracking-wide  font-medium leading-[1.1] mt-1 text-center text-liguriskt lg:text-left lg:tracking-normal lg:font-normal whitespace-pre-line">
                {credits}
              </p>
            )}
          </span>
        </div>
      </div>

      <div className="">
        {/* Description + credits */}

        {!heroImage && (
          <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
            <div className="absolute inset-0 flex items-center justify-center font-visual text-lappar uppercase tracking-widest text-sm bg-lyx">
              Placeholder
            </div>
          </div>
        )}
        {heroImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-h-dvh mb-0 h-dvh cursor-zoom-in"
            style={{
              paddingBottom: `${(1 / (heroImage.aspectRatio || 1)) * 100}%`,
            }}
            onClick={() => setLightboxIndex(0)}
          >
            <Image
              src={heroImage.url}
              alt=""
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </motion.div>
        )}
        {/* Gallery */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-2 pt-2"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
        >
          {restImages.length === 0 ? (
            <>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="relative aspect-square bg-lyx flex items-center justify-center font-visual text-lappar uppercase tracking-widest text-sm"
                >
                  Placeholder
                </div>
              ))}
            </>
          ) : (
            restImages.map((img, i) => (
              <motion.div
                key={img.key}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                transition={{ duration: 0.2 }}
                className="relative aspect-square cursor-zoom-in overflow-hidden"
                onClick={() => setLightboxIndex(i + 1)}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* WORK FOOTER */}
      <div className="flex flex-col justify-center items-center w-full pt-8 text-liguriskt">
        <h4 className="font-visual text-sm lg:text-2xl leading-[1.2] text-center lg:text-left text-liguriskt font-medium tracking-normal lg:tracking-tighter lg:leading-[1] flex flex-wrap justify-center whitespace-break-spaces items-baseline gap-x-0">
          Services provided by <span className="normal-case">Multi²</span> in
          this project:
        </h4>
        <div className="flex flex-wrap justify-center w-full lg:grid lg:grid-cols-4 gap-x-8 gap-y-2 text-sm lg:text-2xl tracking-normal font-medium  uppercase font-visual  leading-tight  mb-16 ">
          {categories.map((c, i) => (
            <span key={c}>
              {i > 0 && ""}
              {CATEGORY_LABELS[c] ?? c}
            </span>
          ))}
        </div>

        <div className="flex flex-col justify-center w-full lg:grid lg:grid-cols-4 gap-x-8 gap-y-2 text-sm lg:text-2xl tracking-normal font-medium   font-visual  leading-tight  mb-16 ">
          {credits && (
            <ul className="lg:col-span-3 font-visual text-sm lg:text-2xl tracking-wide max-w-5xl font-medium leading-[1.4] mt-1 text-center text-liguriskt lg:text-left lg:tracking-normal lg:font-normal lg:indent-16 list-none capitalize">
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
    </div>
  );
}

export default function WorkPageClient(props: {
  title: string;
  client?: string;
  slug: string;
  description?: string;
  credits?: string;
  categories: string[];
  year?: number;
  images: ProjectImage[];
}) {
  return (
    <UIProvider>
      <WorkPageInner {...props} />
    </UIProvider>
  );
}
