"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Lightbox from "@/app/components/Lightbox";

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
  client,
  description,
  credits,
  categories,
  images,
}: {
  client?: string;
  description?: string;
  credits?: string;
  categories: string[];
  images: ProjectImage[];
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div
      className="bg-background dark:bg-lader w-full relative pb-8"
      style={{ paddingTop: "var(--nav-height)" }}
    >
      {/* Client / description / credits */}
      <div className="flex flex-col justify-center items-center lg:items-start px-4 lg:px-8 pb-0 h-[50dvh] lg:h-auto">
        <h1 className="font-visual text-4xl  font-normal uppercase leading-none text-center lg:text-left text-lava tracking-normal lg:tracking-normal lg:leading-[0.9] flex flex-wrap justify-center whitespace-break-spaces mt-0 lg:mt-2 mb-4 items-baseline gap-x-1">
          {client}
        </h1>
        <div className="flex lg:grid lg:grid-cols-6 lg:mb-8 mb-4 ">
          <span className="lg:col-span-4">
            {description ? (
              <p className="font-visual text-3xl lg:text-2xl lg:tracking-normal lg:max-w-4xl leading-[1.1] lg:mt-1 text-center text-lava lg:text-left font-normal max-w-sm">
                {description}
              </p>
            ) : (
              <p className="font-visual text-2xl lg:text-2xl lg:tracking-normal lg:max-w-4xl font-normal leading-[1.1] lg:mt-1 text-center text-lava lg:text-left lg:font-normal max-w-sm mb-4">
                A bold visual concept rooted in craft and intention. Shot on
                location, refined in post. Every frame built around a singular
                idea — to make the ordinary feel inevitable.
              </p>
            )}
          </span>
          <span className="hidden lg:flex lg:col-span-1">
            {credits && (
              <ul className="font-visual text-sm tracking-normal font-normal leading-[1.5] mt-1 text-lava list-none">
                {credits
                  .split("\n")
                  .filter(Boolean)
                  .map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
              </ul>
            )}
          </span>
        </div>
      </div>

      <div className="max-w-7xl">
        {/* Gallery */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-4 gap-2 pt-2 px-2.5 lg:px-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
        >
          {images.length === 0 ? (
            <>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="relative aspect-square bg-lyx flex items-center justify-center font-visual text-lava uppercase tracking-widest text-sm"
                >
                  Placeholder
                </div>
              ))}
            </>
          ) : (
            images.map((img, i) => (
              <motion.div
                key={img.key}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                transition={{ duration: 0.2 }}
                className="relative aspect-square cursor-zoom-in overflow-hidden"
                onClick={() => setLightboxIndex(i)}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* WORK FOOTER */}
      <div className="flex lg:hidden flex-col justify-center items-center lg:grid-cols-6 px-8 w-full pt-8 pb-8 text-lava font-visual text-xl lg:text-2xl lg:items-baseline">
        <h4 className="w-full col-span-2 font-visual text-lg lg:text-2xl leading-tight text-center lg:text-left font-normal tracking-normal lg:tracking-normal lg:leading-[1] flex flex-wrap justify-center lg:justify-start whitespace-break-spaces lg:items-baseline gap-x-0 gap-y-0 max-w-sm text-lyx">
          Services provided by{" "}
          <span className="normal-case font-medium">Multi²</span> in this
          project:
        </h4>

        {categories.map((c, i) => (
          <span className="uppercase font-normal text-2xl text-lava" key={c}>
            {i > 0 && ""}
            {CATEGORY_LABELS[c] ?? c}
          </span>
        ))}

        {credits && (
          <ul className="font-visual text-sm tracking-normal font-normal leading-[1.5] mt-8 text-center text-lava list-none">
            {credits
              .split("\n")
              .filter(Boolean)
              .map((line, i) => (
                <li key={i}>{line}</li>
              ))}
          </ul>
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
  return <WorkPageInner {...props} />;
}
