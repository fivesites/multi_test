"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import ShowReel from "./components/ShowReel";
import TypedHeading from "./components/TypedHeading";

import Footer from "./components/Footer";

/** The standing mobile "sound on/off" toggle in the hero corner — off for now. */
const SHOW_MOBILE_SOUND = false;

/** The connect block's heading. */
const CONNECT_HEADING = "lets start talking today";

const CONNECT_LINKS = [
  {
    label: "email",
    href: "mailto:info@multi2.co",
    col: "col-start-1 lg:col-start-4",
  },
  {
    label: "+46704952184",
    href: "tel:+46704952184",
    col: "col-start-1 lg:col-start-3 col-span-8 whitespace-nowrap",
  },
  { label: "Instagram", href: "#", col: "col-start-1 lg:col-start-2" },
  { label: "Linkedin", href: "#", col: "col-start-1 lg:col-start-6" },
] as const;

function HomeClientInner({ reelUrl }: { reelUrl?: string }) {
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
    <div className="w-full bg-background  px-0 ">
      {/* One gutter for the whole page: px-3 on mobile, px-6 from lg up. */}
      <div className="relative flex  flex-col gap-y-24 w-full px-0 ">
        {/* Relative wrapper so the mobile sound toggle can anchor to the hero's
            bottom corner and scroll away with it, rather than sitting fixed
            over the whole page. Desktop keeps the nav's own Sound On control. */}
        <div className="relative h-screen">
          <LandningBlock
            className="h-screen content-center "
            contentClassName="col-span-3 lg:col-start-1 lg:col-span-12 w-full"
            // The showreel bleeds to the hero's edges, behind the wordmark.
            // Same reel on every width — ShowReel/ReelContext keep one player.
            background={
              <>
                <ShowReel className=" h-full" src={reelUrl} />
                {/* Light scrim so the thin wordmark stays legible over the
                    footage. */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" />
              </>
            }
          >
            {/* Held back until the bar has stopped saying "loading", so the
                two aren't typing at each other. The hero has no label, so its
                wordmark keeps the full twelve columns rather than starting at
                four. */}
            <TypedHeading
              ready={!navLoading}
              text="multisquared"
              className="max-w-sm lg:max-w-full px-3 text-left h1Text min-w-0 whitespace-nowrap break-words text-primary"
            />
          </LandningBlock>
          {/* Mobile sound toggle — hidden for now; flip SHOW_MOBILE_SOUND to
              bring it back. */}
          {SHOW_MOBILE_SOUND && consentSettled && (
            <div className="absolute bottom-0 right-0 z-20 px-0 pb-0 hidden">
              <CheckButton
                size="lg"
                label={muted ? "sound off" : "sound on"}
                active={!muted}
                onClick={toggleMute}
              />
            </div>
          )}
        </div>
        <Reveal className="col-span-3 lg:col-span-12 ">
          <LandningBlock
            label="our story"
            bg="   text-primary  "
            className=" h-auto  "
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
        <section className="relative bg-background">
          <div className="lg:sticky lg:top-16 lg:z-0 grid grid-cols-3 bg-background lg:grid-cols-12 ">
            <LandningBlock
              label="selected projects"
              href="/projects"
              bg="bg-background text-primary"
              className="h-auto   col-start-1 col-span-3 lg:col-start-1  lg:col-span-12     "
            >
              {/* Sits at the content column's start (column four), on the
                  label's baseline. */}
              <TypedHeading
                text="experience our work↗"
                className=" hover:underline underline-offset-9 decoration-[4px] h2Text flex px-6 mb-6 lg:mb-24 font-thin text-primary"
              />
            </LandningBlock>
          </div>

          {/* Opaque band, above the sticky header, so the cards cover it as
              they rise. */}
          <div className="relative lg:z-10  grid grid-cols-3 lg:grid-cols-12 gap-x-3 mt-12 lg:mt-6 w-full px-6 lg:px-0">
            <div className="col-start-1 col-span-3 lg:col-start-1 lg:col-span-12  grid grid-cols-3 lg:grid-cols-12 gap-3 ">
              {featuredProjects.map((project) => (
                <FeaturedCard
                  key={project.key}
                  project={project}
                  className="col-span-3 lg:col-span-5"
                />
              ))}
              <Button
                variant="link"
                size="lgLink"
                className=" col-start-2 col-span-2 lg:col-start-4 lg:col-span-6 text-3xl flex items-baseline h-auto py-0   gap-x-1.5  font-thin   justify-start w-min  "
                asChild
              >
                <Link href="/projects">
                  see more work <span className="font-normal text-xl ">↗</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>
        {/* The featured works as their own grid: one per row on mobile,
              three per row on desktop, under the heading. */}
        <Reveal className="grid grid-cols-3 lg:grid-cols-12 gap-x-3">
          <LandningBlock
            label="connect with us"
            href="/connect"
            bg=" text-primary"
            className="col-span-3 lg:col-start-1 lg:col-span-12 h-auto w-full pb-6 mt-24 "
            labelClassName="col-start-1 col-span-3 lg:col-start-1 lg:col-span-3"
          >
            <div className="grid lg:grid-cols-8 grid-cols-3 items-center gap-y-6 w-full lg:pb-12">
              <TypedHeading
                text={CONNECT_HEADING}
                className="col-start-1 col-span-3 lg:col-span-8   h2Text px-6 lg:px-0   font-thin text-primary mb-6  "
              />

              {CONNECT_LINKS.map((link) => (
                <Button
                  key={link.label}
                  variant="link"
                  size="lgLink"
                  className={`text-3xl flex items-center h-auto py-0 gap-x-1.5 font-thin justify-start w-min ${link.col}`}
                  asChild
                >
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                </Button>
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

export default function HomeClient({ reelUrl }: { reelUrl?: string }) {
  return <HomeClientInner reelUrl={reelUrl} />;
}
