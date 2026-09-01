"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
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
  children: ReactNode;
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
  children,
}: Props) {
  return (
    <section
      className={cn(
        "relative z-10 w-full grid grid-cols-4 content-start gap-3",
        bg,
        className,
      )}
    >
      {label && (
        // The placement sits on a wrapper rather than on CheckButton:
        // CheckButton puts its className on both its outer link and its inner
        // box, so column classes passed straight in would move the inner box
        // out of place too. Mobile has no room for a quarter-width gutter at
        // this type size, so the label only steps in to column two on desktop.
        <div className="col-start-1 col-span-4 lg:col-start-2 lg:col-span-3">
          <CheckButton label={label} href={href} size="lg" active />
        </div>
      )}
      <div className="col-start-1 col-span-4 w-full">{children}</div>
    </section>
  );
}
