"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { UIProvider } from "@/context/UIContext";
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
  const navRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setNavHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="bg-background w-full relative">
      {/* Nav wrapper — measured for content offset */}
      <div ref={navRef} className="absolute top-0 left-0 right-0 z-10">
        {/* Mobile nav */}
        <div className="px-4 pt-2 w-full grid grid-cols-3 items-start lg:hidden">
          <Button
            variant="link"
            className={`font-visual text-sm font-medium tracking-wide text-lava leading-tight uppercase px-0`}
            asChild
          >
            <Link href="/">Back</Link>
          </Button>
          <span
            className={`font-visual text-sm font-medium tracking-wide text-lava leading-tight uppercase text-center`}
          >
            {title}
          </span>
          <span
            className={`font-visual text-sm font-medium tracking-wide text-lava leading-tight text-right`}
          >
            {year}
          </span>
        </div>

        {/* Desktop nav */}
        <div className="px-8 pt-8 w-full hidden lg:flex flex-col items-start">
          <Button
            variant="link"
            className={`font-visual text-lg font-medium tracking-wide text-lava leading-tight uppercase`}
            asChild
          >
            <Link href="/">Back</Link>
          </Button>
          <div className="flex items-baseline">
            {client && (
              <span
                className={`font-visual text-lg font-medium tracking-wide text-lava leading-tight`}
              >
                {client}
                {", "}
              </span>
            )}
            <span
              className={`font-visual ml-1 text-lg font-medium tracking-wide text-lava leading-tight uppercase`}
            >
              {title}
              {year && ", "}
            </span>
            {year && (
              <span
                className={`font-visual text-lg ml-1 font-medium tracking-wide text-lava leading-tight`}
              >
                {year}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Client / description / credits */}
      <div
        className="flex flex-col justify-center items-center lg:items-start px-4 lg:px-8 pb-0 "
        style={{ paddingTop: navHeight || undefined }}
      >
        <h1 className="font-visual text-5xl lg:text-4xl font-medium uppercase leading-none text-center lg:text-left text-lava tracking-tight lg:tracking-normal lg:leading-[0.9] flex flex-wrap justify-center whitespace-break-spaces mt-8 lg:mt-0 mb-2 lg:mb-4 items-baseline gap-x-1">
          {client}
        </h1>
        <div className="flex lg:grid lg:grid-cols-6 lg:mb-8">
          <span className="lg:col-span-3">
            {description ? (
              <p className="font-visual  text-2xl lg:text-2xl lg:tracking-normal lg:max-w-3xl font-medium leading-[1.1] lg:mt-1 text-center text-lava lg:text-left lg:font-normal max-w-sm ">
                {description}
              </p>
            ) : (
              <p className="font-visual text-2xl lg:text-2xl lg:tracking-normal lg:max-w-3xl font-medium leading-[1.1] lg:mt-1 text-center text-lava lg:text-left lg:font-normal max-w-sm ">
                A bold visual concept rooted in craft and intention. Shot on
                location, refined in post. Every frame built around a singular
                idea — to make the ordinary feel inevitable.
              </p>
            )}
          </span>
          <span className="hidden lg:flex lg:col-span-1">
            {credits && (
              <p className="font-visual text-sm tracking-wide font-medium leading-[1.1] mt-1 text-center text-lava lg:text-left lg:tracking-normal lg:font-normal whitespace-pre-line">
                {credits}
              </p>
            )}
          </span>
        </div>
      </div>

      <div className="">
        {/* Gallery */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-4 gap-2 pt-2 px-8"
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
      <div className="flex lg:hidden  flex-col  justify-center items-center   lg:grid-cols-6 px-8 w-full pt-8 pb-8 text-lava font-visual text-xl lg:text-2xl lg:items-baseline  ">
        <h4 className="w-full col-span-2 font-visual text-xl lg:text-2xl leading-tight text-center lg:text-left font-normal  tracking-normal lg:tracking-normal lg:leading-[1] flex flex-wrap justify-center lg:justify-start whitespace-break-spaces lg:items-baseline gap-x-0 gap-y-0 ">
          Services provided by <span className="normal-case">Multi²</span> in
          this project:
        </h4>

        {categories.map((c, i) => (
          <span className="uppercase font-medium text-lg" key={c}>
            {i > 0 && ""}
            {CATEGORY_LABELS[c] ?? c}
          </span>
        ))}

        <div className="flex lg:hidden flex-col justify-center w-full gap-x-8 gap-y-2 text-sm lg:text-2xl tracking-normal font-medium   font-visual  leading-tight mt-8 mb-8 ">
          {credits && (
            <ul className="lg:col-span-3 font-visual text-sm lg:text-2xl tracking-wide max-w-5xl font-medium leading-[1.4] mt-1 text-center text-lava lg:text-left lg:tracking-normal lg:font-normal lg:indent-16 list-none capitalize">
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
