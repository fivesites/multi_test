"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useUI } from "@/context/UIContext";
import { useWork, type GridItem } from "@/context/WorkContext";
import { useCopyEntry, useCopyBody } from "@/context/CopyContext";
import { useSound } from "@/context/SoundContext";
import { useLenis } from "lenis/react";
import Link from "next/link";
import AboutSectionText from "./components/AboutSectionText";
import CheckButton from "./components/CheckButton";
import IconButton from "./components/IconButton";
import LandningBlock from "./components/LandningBlock";
import { Reveal } from "./components/Reveal";
import PixelFrame from "./components/PixelFrame";
import TypedHeading from "./components/TypedHeading";
import { TYPING_INTERVAL } from "./components/TypedWord";

import Footer from "./components/Footer";

const MotionLink = motion.create(Link);

/** The connect block's heading; its links stagger in once it has finished
 *  typing itself out. */
const CONNECT_HEADING = "lets start talking today";
const CONNECT_TYPING_DONE = CONNECT_HEADING.length * TYPING_INTERVAL;

const CONNECT_LINKS = [
  {
    label: "email",
    href: "mailto:info@multi2.co",
    col: "col-start-1 lg:col-start-1",
  },
  {
    label: "+46704952184",
    href: "tel:+46704952184",
    col: "col-start-1 lg:col-start-3 col-span-8 whitespace-nowrap",
  },
  { label: "Instagram", href: "#", col: "col-start-1 lg:col-start-2" },
  { label: "Linkedin", href: "#", col: "col-start-1 lg:col-start-6" },
] as const;

/** One connect link — an h2-sized anchor that lifts and fades in on a delay,
 *  so the row arrives after the heading has typed. Plain h2 under reduced
 *  motion. */
function ConnectLink({
  label,
  href,
  col,
  order,
}: {
  label: string;
  href: string;
  col: string;
  order: number;
}) {
  const reduce = useReducedMotion();
  const external = href.startsWith("http");
  const anchor = (
    <a
      href={href}
      className="transition-colors hover:text-secondary"
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {label}
    </a>
  );

  if (reduce) return <h2 className={`h2Text ${col}`}>{anchor}</h2>;

  return (
    <motion.h2
      className={`h2Text ${col}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: CONNECT_TYPING_DONE + order * 0.09,
      }}
    >
      {anchor}
    </motion.h2>
  );
}

/**
 * One selected-projects card. Runs two-up on desktop. Its horizontal inset
 * breathes with scroll — widest (px-6) off-centre, tightening to px-3 as the
 * card crosses the middle of the viewport, then easing back. Scroll-driven;
 * steps aside for reduced motion.
 */
function FeaturedCard({ project }: { project: GridItem }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // 24px (px-6) → 12px (px-3) → 24px, peak tightening at viewport centre.
  const inset = useTransform(scrollYProgress, [0, 0.5, 1], [24, 12, 24]);

  return (
    <MotionLink
      ref={ref}
      href={`/projects/${project.slug}`}
      className="col-span-3 lg:col-span-5 grid grid-cols-3 bg-background pixelCorners  group relative lg:flex lg:flex-col gap-3 lg:gap-6 w-full mb-6 "
      style={reduce ? undefined : { paddingLeft: inset, paddingRight: inset }}
    >
      <div className="relative col-span-3 w-full">
        <PixelFrame
          src={project.coverUrl ?? project.url}
          alt={project.alt}
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="w-full aspect-square"
        />

        {/* Client sits centred over the image at every breakpoint; the desktop
            title bar across the top is desktop-only. */}
        <div className="hidden  absolute inset-x-0 top-0 z-10 p-6 pText text-primary lowercase lg:grid grid-cols-12 items-baseline">
          <h3 className="col-start-2 pText px-3">title</h3>
          <h3 className="col-start-6 h3Text col-span-3">{project.title}</h3>
        </div>
        {project.client && (
          <span className="flex absolute inset-0 z-10 items-center lg:justify-start justify-center text-center px-24 lg:px-24 lg:text-left h2Text text-primary whitespace-normal lowercase">
            {project.client}
          </span>
        )}
      </div>

      {/* Mobile: title on its own line below the image. */}
      <h3 className="hidden pText text-primary col-start-2 col-span-2 mb-6 pr-3 lowercase">
        {project.title}
      </h3>
    </MotionLink>
  );
}

function HomeClientInner() {
  const { items } = useWork();
  const { notifyContentDone, navLoading } = useUI();
  const { muted, toggleMute, consentSettled } = useSound();
  const lenis = useLenis();

  const [revealed, setRevealed] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const hasRevealedRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => setTimerDone(true), 4000);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (items.length === 0 || !timerDone || hasRevealedRef.current) return;
    hasRevealedRef.current = true;
    setRevealed(true);
  }, [items.length, timerDone]);

  useEffect(() => {
    if (!revealed) return;
    notifyContentDone();
  }, [revealed, notifyContentDone]);

  const aboutEntry = useCopyEntry("about-intro");
  const aboutBody = useCopyBody("about-intro");

  // The landing page's selected-projects block: three works, featured first.
  // Editors pick those with the "Featured on homepage" toggle in the CMS
  // (workCardsQuery orders by year, so newest featured leads); any remaining
  // slots fill with the most recent non-featured works so the row is always
  // full.
  const featuredProjects = useMemo(() => {
    const primary = items.filter((i) => i.isPrimary);
    const picked = primary.filter((i) => i.featured);
    const filler = primary.filter((i) => !i.featured);
    return [...picked, ...filler].slice(0, 3);
  }, [items]);

  return (
    <div className="w-full  px-0 ">
      <div className="relative flex min-h-dvh flex-col gap-y-24 w-full ">
        {/* Relative wrapper so the mobile sound toggle can anchor to the hero's
            bottom corner and scroll away with it, rather than sitting fixed
            over the whole page. Desktop keeps the nav's own Sound On control. */}
        <div className="relative h-dvh">
          <LandningBlock className="h-dvh content-center ">
            {/* Its own container, so the wordmark measures against this box
                  and not the viewport — and so container-type's layout
                  containment stays off the section, whose fixed children still
                  have to anchor to the viewport. */}
            <div className="grid grid-cols-3 lg:grid-cols-12 items-center w-full">
              {/* Held back until the bar has stopped saying "loading", so the
                  two aren't typing at each other. */}
              <TypedHeading
                ready={!navLoading}
                text="multisquared"
                className="col-start-2  lg:col-start-4 px-3 text-left  h2Text  font-thin text-primary"
              />
            </div>
          </LandningBlock>
          {consentSettled && (
            <div className="absolute bottom-0 right-0 z-20 px-6 pb-6 lg:hidden">
              <CheckButton
                size="label"
                label={muted ? "sound off" : "sound on"}
                active={!muted}
                onClick={toggleMute}
              />
            </div>
          )}
        </div>
        <Reveal className="grid grid-cols-3 lg:grid-cols-12 px-0 lg:px-6 ">
          <LandningBlock
            label="our story"
            bg="   text-primary  "
            className="col-start-1 col-span-3 lg:col-start-3 lg:col-span-8 h-auto  "
          >
            <AboutSectionText
              plainText={aboutEntry?.plainText ?? ""}
              text={aboutBody ?? undefined}
              className="w-full justify-center lg:content-center pb-6 lg:pb-12"
            />
          </LandningBlock>
        </Reveal>

        {/* Selected projects: the label + typed header pin under the nav on
            desktop while the featured cards scroll up and slide over them.
            Not wrapped in <Reveal> — a settling transform on the ancestor
            would fight the sticky positioning. */}
        <section className="relative">
          <div className="lg:sticky lg:top-24 lg:z-0 grid grid-cols-3 lg:grid-cols-12 pl-3 lg:px-6">
            <LandningBlock
              label="selected projects"
              href="/projects"
              className="h-auto   col-start-1 col-span-3 lg:col-start-3  lg:col-span-8     "
            >
              {/* Same four/eight-column grid the block's label sits on, so the
                heading lines up under "selected projects" in column two. */}
              <div className="grid grid-cols-3 lg:grid-cols-8 w-full">
                <TypedHeading
                  text="experience our work"
                  className=" h2Text flex col-start-2 col-span-3 lg:col-start-2 lg:col-span-6 pr-3 lg:pr-0 mb-6 lg:mb-0 font-thin text-primary"
                />
              </div>
            </LandningBlock>
          </div>

          {/* Opaque band, above the sticky header, so the cards cover it as
              they rise. */}
          <div className="relative lg:z-10 bg-background grid grid-cols-3 lg:grid-cols-12 gap-x-3 pl-3 lg:px-6 mt-12 lg:mt-6">
            <div className="col-start-1 col-span-3 lg:col-start-3 lg:col-span-9  grid grid-cols-3 lg:grid-cols-6 gap-3 ">
              {featuredProjects.map((project) => (
                <FeaturedCard key={project.key} project={project} />
              ))}
            </div>
            <IconButton
              size="label"
              href="/projects"
              label="see more work"
              icon="↗"
              className="col-start-2 col-span-3 lg:col-start-6 lg:mt-12"
            />
          </div>
        </section>
        {/* The featured works as their own grid: one per row on mobile,
              three per row on desktop, under the heading. */}
        <Reveal className="grid grid-cols-3 lg:grid-cols-12 gap-x-3 px-3 lg:px-6 ">
          <LandningBlock
            label="connect with us"
            href="/connect"
            bg=" text-primary"
            className="col-span-3 lg:col-start-3 lg:col-span-8 h-auto  flex-col items-center justify-center  w-full pb-6 px-3 lg:px-0 mt-24  grid grid-cols-3 lg:grid-cols-8 "
            // The content sits on its own 12-column grid starting at column 4
            // (25%). Column 3 of the block's 8-column grid is the same 25%, so the
            // label lines up above the heading, copy and button.
            labelClassName="col-start-2 col-span-3 lg:col-start-2 lg:col-span-4"
          >
            <div className="col-start-2 lg:col-start-2 lg:col-span-8 grid lg:grid-cols-8 grid-cols-3 items-center justify-center gap-y-6 w-full pb- lg:pb-12">
              <TypedHeading
                text={CONNECT_HEADING}
                className="col-start-2 lg:col-start-2 col-span-2 lg:col-span-8   h2Text  font-thin text-primary mb-6  "
              />

              {CONNECT_LINKS.map((link, i) => (
                <ConnectLink key={link.label} order={i} {...link} />
              ))}
            </div>
          </LandningBlock>
        </Reveal>
        <Reveal className="grid grid-cols-3 lg:grid-cols-12 px-3 lg:px-6">
          <IconButton
            size="label"
            label="top"
            icon="↑"
            className="col-start-1 lg:col-start-2"
            onClick={() =>
              lenis
                ? lenis.scrollTo(0)
                : window.scrollTo({ top: 0, behavior: "smooth" })
            }
          />
          <IconButton
            size="label"
            href="/projects"
            label="next"
            icon="→"
            className="col-start-3 lg:col-start-10"
          />
        </Reveal>

        <Reveal>
          <Footer />
        </Reveal>
      </div>
    </div>
  );
}

export default function HomeClient() {
  return <HomeClientInner />;
}
