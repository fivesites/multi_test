"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { UIProvider } from "@/context/UIContext";
import MultiNav from "@/app/components/MultiNav";
import Lightbox from "@/app/components/Lightbox";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-background ">
      {/* Back button — fixed at same baseline as MultiNav Row 1 */}

      <div className="absolute top-4 left-0 right-0 z-10 grid grid-cols-3 w-full items-start justify-center px-4 gap-4">
        <span className="font-visual text-xl text-lava leading-tight">
          {title}
        </span>

        <Button
          variant="link"
          className="pointer-events-auto tracking-wide w-full text-center"
          asChild
        >
          <Link href="/">Back</Link>
        </Button>
        <span className="font-visual text-xl  text-lax  leading-tight w-full text-right">
          {year}
        </span>
      </div>

      <div className="px-2 mt-[25vh] ">
        {/* Header */}
        <div className="flex flex-col justify-center items-center w-full lg:grid lg:grid-cols-4 gap-0 px-6  mb-16">
          <h1 className="font-visual text-5xl lg:text-9xl uppercase leading-none text-center lg:text-left text-liguriskt font-normal tracking-tight lg:tracking-tighter lg:leading-[0.9] flex flex-wrap justify-center whitespace-break-spaces items-baseline gap-x-1">
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
                className="fill-lappar"
              />
            </svg>
          </h1>
          <p className="col-span-3 font-visual text-2xl lg:text-3xl tracking-wide max-w-5xl font-medium leading-[1.1] mt-1 text-center text-liguriskt lg:text-left lg:tracking-normal lg:font-normal lg:indent-16">
            A bold visual concept rooted in craft and intention. Shot on
            location, refined in post. Every frame built around a singular idea
            — to make the ordinary feel inevitable.
          </p>
        </div>
        {/* Hero image */}

        {/* Description + credits */}
        {(description || credits) && (
          <div className=" grid-cols-1 lg:grid-cols-4 gap-x-8 mb-16 hidden">
            {description && (
              <p className="text-3xl lg:text-2xl font-visual  text-red-500 leading-tight col-span-2 max-w-sm  mb-16 ">
                {description}
              </p>
            )}
            {credits && (
              <p
                className="hiddentext-3xl lg:text-2xl font-visual  text-red-500 leading-tight max-w-sm lg:max-w-xl"
                style={{ whiteSpace: "pre-line" }}
              >
                {credits}
              </p>
            )}
          </div>
        )}
        <div className="flex flex-wrap justify-center w-full lg:grid lg:grid-cols-4 gap-x-8 gap-y-2 text-xl lg:text-lg uppercase font-visual font-medium  text-red-600 leading-tight  mb-16 ">
          {categories.map((c, i) => (
            <span key={c}>
              {i > 0 && ""}
              {CATEGORY_LABELS[c] ?? c}
            </span>
          ))}
        </div>
        {heroImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="relative w-full mt-8 mb-0 h-dvh cursor-zoom-in"
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
        {restImages.length > 0 && (
          <motion.div
            className="columns-2 md:columns-3 gap-2 pt-2"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
          >
            {restImages.map((img, i) => (
              <motion.div
                key={img.key}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                transition={{ duration: 0.2 }}
                className="relative break-inside-avoid mb-2 cursor-zoom-in"
                style={{
                  paddingBottom: `${(1 / (img.aspectRatio || 1)) * 100}%`,
                }}
                onClick={() => setLightboxIndex(i + 1)}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
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
