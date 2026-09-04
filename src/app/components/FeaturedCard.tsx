"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { GridItem } from "@/context/WorkContext";
import PixelFrame from "./PixelFrame";

const MotionLink = motion.create(Link);

/**
 * A project card for the home page's selected projects (two-up on desktop).
 * Its horizontal inset breathes with scroll: widest (px-6) off-centre,
 * tightening to px-3 as the card crosses the middle of the viewport, then
 * easing back. Scroll-driven; steps aside for reduced motion.
 *
 * The grid span is the caller's — pass it through `className`; the card itself
 * only claims a single cell (`col-span-1`).
 *
 * With `captionBelow` — the treatment the home page uses — the client and
 * title sit in a caption under the image (client in `pText`, title in
 * `h4BtnText`) instead of over it. Without it, the client sits above the
 * image on mobile and both are set over it on desktop; no current caller
 * uses that mode, but it's kept as the plain default.
 *
 * With `revealOnView`, the card also scales up from 0.9 and fades in the first
 * time it scrolls into view.
 */
export default function FeaturedCard({
  project,
  revealOnView = false,
  captionBelow = false,
  className,
}: {
  project: GridItem;
  revealOnView?: boolean;
  captionBelow?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // 24px (px-6) → 12px (px-3) → 24px, peak tightening at viewport centre.
  const inset = useTransform(scrollYProgress, [0, 0.5, 1], [12, 3, 12]);

  const reveal =
    revealOnView && !reduce
      ? {
          initial: { opacity: 0, scale: 0.9 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true, margin: "0px 0px -24% 0px" },
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
        }
      : {};

  return (
    <MotionLink
      {...reveal}
      ref={ref}
      href={`/projects/${project.slug}`}
      className={cn(
        "col-span-1 grid grid-cols-3 bg-background pixelCorners group relative lg:flex lg:flex-col gap-3 lg:gap-3 w-full mb-3 lg:mb-6",
        className,
      )}
      style={reduce ? undefined : { paddingLeft: inset, paddingRight: inset }}
    >
      {project.client && !captionBelow && (
        <h2 className="lg:hidden col-span-3 h2Text text-primary lowercase">
          {project.client}
        </h2>
      )}

      <div className="relative col-span-3 w-full">
        <PixelFrame
          src={project.coverUrl ?? project.url}
          alt={project.alt}
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="w-full aspect-square "
        />

        {!captionBelow && (
          <>
            {/* Title centred across the top of the image, client centred over it. */}
            <h4 className="hidden lg:absolute inset-x-0 top-0 z-10 p-6 h4BtnText text-primary lowercase text-center">
              {project.title}
            </h4>
            {project.client && (
              <span className="hidden lg:flex absolute inset-0 z-10 items-center justify-center px-6 text-center h2Text text-primary lowercase max-w-xl mx-auto">
                {project.client}
              </span>
            )}
          </>
        )}
      </div>

      {captionBelow && (
        <div className="col-span-3 w-full flex flex-col gap-1 lg:gap-2">
          {project.client && (
            <span className="pText text-primary px-6 lowercase">
              {project.client}
            </span>
          )}
          <h4 className="h4BtnText text-primary px-6 lowercase hidden ">
            {project.title}
          </h4>
        </div>
      )}
    </MotionLink>
  );
}
