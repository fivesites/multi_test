"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import Link from "next/link";
import type { GridItem } from "@/context/WorkContext";
import PixelFrame from "./PixelFrame";

const MotionLink = motion.create(Link);

/**
 * A project card with its title and client set over the cover image — used for
 * the home page's selected projects (two-up on desktop) and the projects
 * page's mobile list (one per row). On mobile the client name sits above the
 * cover image; on desktop it's set over it. Its horizontal inset breathes with scroll:
 * widest (px-6) off-centre, tightening to px-3 as the card crosses the middle
 * of the viewport, then easing back. Scroll-driven; steps aside for reduced
 * motion.
 *
 * With `revealOnView`, the card also scales up from 0.9 and fades in the first
 * time it scrolls into view.
 */
export default function FeaturedCard({
  project,
  revealOnView = false,
}: {
  project: GridItem;
  revealOnView?: boolean;
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
      className="col-span-3 lg:col-span-5 grid grid-cols-3 bg-background pixelCorners  group relative lg:flex lg:flex-col gap-3 lg:gap-6 w-full mb-3 lg:mb-6 "
      style={reduce ? undefined : { paddingLeft: inset, paddingRight: inset }}
    >
      {project.client && (
        <h2 className="lg:hidden col-span-3 h2Text text-primary lowercase">
          {project.client}
        </h2>
      )}

      <div className="relative col-span-3 w-full">
        <PixelFrame
          src={project.coverUrl ?? project.url}
          alt={project.alt}
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="w-full aspect-square"
        />

        {/* Title centred across the top of the image, client centred over it. */}
        <h4 className="hidden lg:absolute inset-x-0 top-0 z-10 p-6 h4BtnText text-primary lowercase text-center">
          {project.title}
        </h4>
        {project.client && (
          <span className="hidden lg:flex absolute inset-0 z-10 items-center justify-center px-6 text-center h2Text text-primary lowercase max-w-xl mx-auto">
            {project.client}
          </span>
        )}
      </div>
    </MotionLink>
  );
}
