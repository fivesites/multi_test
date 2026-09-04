"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import { useCopyEntry, useCopyBody } from "@/context/CopyContext";
import { useSound } from "@/context/SoundContext";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AboutSectionText from "./components/AboutSectionText";
import CheckButton from "./components/CheckButton";
import FeaturedCard from "./components/FeaturedCard";
import IconButton from "./components/IconButton";
import LandningBlock from "./components/LandningBlock";
import { Reveal } from "./components/Reveal";
import TypedHeading from "./components/TypedHeading";
import { TYPING_INTERVAL } from "./components/TypedWord";

import Footer from "./components/Footer";

/** The standing mobile "sound on/off" toggle in the hero corner — off for now. */
const SHOW_MOBILE_SOUND = false;

/** The connect block's heading; its links stagger in once it has finished
 *  typing itself out. */
const CONNECT_HEADING = "lets start talking today";
const CONNECT_TYPING_DONE = CONNECT_HEADING.length * TYPING_INTERVAL;

const CONNECT_LINKS = [
  {
    label: "email",
    href: "mailto:info@multi2.co",
    col: "col-start-2 lg:col-start-1",
  },
  {
    label: "+46704952184",
    href: "tel:+46704952184",
    col: "col-start-2 lg:col-start-3 col-span-8 whitespace-nowrap",
  },
  { label: "Instagram", href: "#", col: "col-start-2 lg:col-start-2" },
  { label: "Linkedin", href: "#", col: "col-start-2 lg:col-start-6" },
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
      {/* One gutter for the whole page: px-3 on mobile, px-6 from lg up. */}
      <div className="relative flex min-h-dvh flex-col gap-y-24 w-full px-0 lg:px-6">
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
          {/* Mobile sound toggle — hidden for now; flip SHOW_MOBILE_SOUND to
              bring it back. */}
          {SHOW_MOBILE_SOUND && consentSettled && (
            <div className="absolute bottom-0 right-0 z-20 px-6 pb-6 hidden">
              <CheckButton
                size="label"
                label={muted ? "sound off" : "sound on"}
                active={!muted}
                onClick={toggleMute}
              />
            </div>
          )}
        </div>
        <Reveal className="grid grid-cols-3 lg:grid-cols-12">
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
          <div className="lg:sticky lg:top-24 lg:z-0 grid grid-cols-3 lg:grid-cols-12">
            <LandningBlock
              label="selected projects"
              href="/projects"
              className="min-h-[50dvh]   col-start-1 col-span-3 lg:col-start-3  lg:col-span-8     "
            >
              {/* Same four/eight-column grid the block's label sits on, so the
                heading lines up under "selected projects" in column two. */}
              <div className="grid grid-cols-3 lg:grid-cols-8 w-full">
                <TypedHeading
                  text="experience our work"
                  className=" h2Text flex col-start-2 col-span-3 lg:col-start-2 lg:col-span-6 pr-0 lg:pr-0 mb-6 lg:mb-0 font-thin text-primary"
                />
              </div>
            </LandningBlock>
          </div>

          {/* Opaque band, above the sticky header, so the cards cover it as
              they rise. */}
          <div className="relative lg:z-10 bg-background grid grid-cols-3 lg:grid-cols-12 gap-x-3 mt-12 lg:mt-6 w-full">
            <div className="col-start-1 col-span-3 lg:col-start-3 lg:col-span-9  grid grid-cols-3 lg:grid-cols-6 gap-3 ">
              {featuredProjects.map((project) => (
                <FeaturedCard
                  key={project.key}
                  project={project}
                  captionBelow
                  className="col-span-3 lg:col-span-5"
                />
              ))}
            </div>
            <Button
              variant="link"
              size="lgLink"
              className=" col-start-2 lg:col-start-4 text-3xl flex items-baseline h-auto py-0   gap-x-1.5  font-thin   justify-start w-min  "
              asChild
            >
              <Link href="/projects">
                see more work <span className="font-normal text-xl ">↗</span>
              </Link>
            </Button>
          </div>
        </section>
        {/* The featured works as their own grid: one per row on mobile,
              three per row on desktop, under the heading. */}
        <Reveal className="grid grid-cols-3 lg:grid-cols-12 gap-x-3">
          <LandningBlock
            label="connect with us"
            href="/connect"
            bg=" text-primary"
            className="col-span-3 lg:col-start-3 lg:col-span-8 h-auto  flex-col items-center justify-center  w-full pb-6 mt-24  grid grid-cols-3 lg:grid-cols-8 "
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
        <Reveal className="grid grid-cols-3 lg:grid-cols-12">
          <Button
            variant="link"
            size="lgLink"
            className=" col-start-1 lg:col-start-4 text-3xl flex items-center h-auto py-0   gap-x-1.5  font-thin   justify-start w-min   "
            onClick={() =>
              lenis
                ? lenis.scrollTo(0)
                : window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            top <span className="font-normal text-xl ">↑</span>
          </Button>

          <Button
            variant="link"
            size="lgLink"
            className=" col-start-3 lg:col-start-8 text-3xl flex items-center h-auto py-0   gap-x-1.5  font-thin   justify-start w-min "
            asChild
          >
            <Link href="/projects">
              next <span className="font-normal text-xl ">→</span>
            </Link>
          </Button>
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
