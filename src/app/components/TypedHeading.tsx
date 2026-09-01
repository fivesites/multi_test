"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import TypedWord from "./TypedWord";

/** A heading that types itself out the first time it scrolls into view, and
 *  then stays put — `once` so a heading doesn't re-type every time it passes
 *  back through the viewport.
 *
 *  The ref sits on the heading rather than on TypedWord: TypedWord hides its
 *  letters with display:none, so before it runs it has almost no box of its
 *  own to measure against the viewport. */
export default function TypedHeading({
  text,
  className,
  amount = 0.2,
  ready = true,
}: {
  text: string;
  className?: string;
  /** How much of the heading has to be on screen before it starts. */
  amount?: number;
  /** Holds the typing back until something else is done — the hero waits on
   *  the nav bar, so the two aren't typing over each other. In view still has
   *  to be true as well; this only ever delays, never triggers. */
  ready?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount });

  return (
    <h2 ref={ref} className={className}>
      <TypedWord text={text} visible={inView && ready} delay={0} />
    </h2>
  );
}
