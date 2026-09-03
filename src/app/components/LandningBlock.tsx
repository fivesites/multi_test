"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { usePixelCorners } from "@/app/hooks/usePixelCorners";
import CheckButton from "./CheckButton";

type Props = {
  /** Background and its paired text colour, e.g. "bg-secondary text-primary". */
  bg?: string;
  /** The block's CheckButton. Omit for an unlabelled block such as the hero. */
  label?: string;
  /** Where the label links. Without it the label is a plain marker. */
  href?: string;
  /** Height, padding and row alignment — whatever this block needs on top of
   *  the shared grid. */
  className?: string;
  /** Overrides the label wrapper's column placement when a block's content
   *  sits on a different column than the default second one — pass the
   *  matching `col-start-*` / `col-span-*` so the label lines up with it. */
  labelClassName?: string;
  /** An absolutely-positioned layer behind the label and content — e.g. a hero
   *  image that bleeds to the block's edges while the label keeps to the grid.
   *  Clipped to the same notched-corner shape as the block. */
  background?: ReactNode;
  children?: ReactNode;
};

/** The one section shape the landing page is built from: a four-column grid
 *  with the label in column two and the content flowing beneath it. Only the
 *  background, the label and the contents change between blocks.
 *
 *  Children are wrapped in a full-width cell rather than dropped straight into
 *  the grid, so a block's contents can carry whatever inner grid they like
 *  without having to be aware of this one. */
export default function LandningBlock({
  bg = "bg-background text-primary",
  label,
  href,
  className,
  labelClassName,
  background,
  children,
}: Props) {
  // Notches the block's four corners, scaled to its size — same treatment the
  // buttons get, so the sections read as part of the same family.
  const pixelRef = usePixelCorners<HTMLElement>();

  return (
    <section
      ref={pixelRef}
      className={cn(
        "pixelCorners relative z-10 w-full grid grid-cols-3 lg:grid-cols-8 space-y-12 lg:space-y-6  ",
        bg,
        className,
      )}
    >
      {background && (
        <div className="absolute inset-0 z-0 overflow-hidden">{background}</div>
      )}
      {label && (
        // The placement sits on a wrapper rather than on CheckButton:
        // CheckButton puts its className on both its outer link and its inner
        // box, so column classes passed straight in would move the inner box
        // out of place too. Mobile has no room for a quarter-width gutter at
        // this type size, so the label only steps in to column two on desktop.
        <div
          className={cn(
            "relative z-10 flex items-start justify-start pt-6 lg:pt-12",
            labelClassName ??
              "col-start-2 col-span-3 lg:col-start-2 lg:col-span-3",
          )}
        >
          <CheckButton label={label} href={href} size="label" active />
        </div>
      )}
      {children && (
        <div className="relative z-10 mt-0 lg:mt-0 col-start-1 lg:col-start-1 col-span-4 lg:col-span-10 w-full">
          {children}
        </div>
      )}
    </section>
  );
}
