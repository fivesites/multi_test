"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import { useCopyEntry, useCopyBody } from "@/context/CopyContext";
import { useSound } from "@/context/SoundContext";
import { useLenis } from "lenis/react";
import Link from "next/link";
import AboutSectionText from "./components/AboutSectionText";
import CheckButton from "./components/CheckButton";
import LandningBlock from "./components/LandningBlock";
import { Reveal } from "./components/Reveal";
import PixelFrame from "./components/PixelFrame";
import TypedHeading from "./components/TypedHeading";
import { Button } from "@/components/ui/button";

import Footer from "./components/Footer";

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
            label="about us"
            href="/about"
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

        <Reveal className="grid grid-cols-3 lg:grid-cols-12 gap-x-3 pl-3 lg:px-6 ">
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
          <div className="col-start-1 col-span-3 lg:col-start-2 lg:col-span-10  grid grid-cols-3 lg:grid-cols-6 gap-3 mt-12 lg:mt-6 ">
            {featuredProjects.map((project, i) => (
              <Link
                key={project.key}
                href={`/projects/${project.slug}`}
                className="col-span-3 grid grid-cols-3 bg-background pixelCorners  group relative lg:flex lg:flex-col gap-3 lg:gap-6 w-full mb-6 "
              >
                <PixelFrame
                  src={project.coverUrl ?? project.url}
                  alt={project.alt}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="w-full aspect-square col-span-3"
                  revealOnView
                  revealDelay={i * 0.08}
                />

                <h3 className=" h3Text text-primary col-start-2 col-span-2 lg:px-6 mb-6 pr-3 lg:pr-0  lg:mb-6 lowercase ">
                  {project.title}
                </h3>
              </Link>
            ))}
          </div>
          <Button
            variant="link"
            size="lgLink"
            className=" h2Text flex col-start-2 col-span-3 lg:col-start-6 lg:col-span- pr-0 lg:pr-0 gap-x-3  font-thin text-primary w-min lg:mt-12"
          >
            see more work <span className="font-normal ">↗</span>
          </Button>
        </Reveal>
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
                text="lets start talking today"
                className="col-start-2 lg:col-start-2 col-span-3 lg:col-span-8   h2Text  font-thin text-primary mb-6  "
              />
              <p className="text-primary pText col-start-1 lg:col-start-2 col-span-4 indent-[calc(33.3vw-1rem)] lg:indent-0 lg:col-span-6  lg:p-0 lowercase ">
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
                faucibus ex sapien vitae pellentesque sem placerat. In id cursus
                mi pretium tellus duis convallis.{" "}
              </p>

              <span className="col-start-2 col-span-3 lg:col-start-2 lg:col-span-6  ">
                <Button
                  variant="link"
                  size="lgLink"
                  className=" h2Text flex col-start-2 col-span-3 lg:col-start-6 lg:col-span- px-3 h-24 gap-x-3  font-thin text-secondary pixelCorners w-full justify-center lg:mt-12 bg-primary "
                >
                  connect now <span className="font-normal ">↗</span>
                </Button>
              </span>
            </div>
          </LandningBlock>
        </Reveal>
        <Reveal className="grid grid-cols-3 lg:grid-cols-12 px-3 lg:px-6">
          <Button
            variant="link"
            size="lgLink"
            className=" col-start-1 lg:col-start-4 h2Text flex    gap-x-3  font-thin   justify-start w-min   "
            onClick={() =>
              lenis
                ? lenis.scrollTo(0)
                : window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            top <span className="font-normal ">↑</span>
          </Button>
          <Button
            variant="link"
            size="lgLink"
            className=" col-start-3 lg:col-start-10 h2Text flex px-0    gap-x-3  font-thin  justify-start w-min "
            asChild
          >
            <Link href="/projects">
              next <span className="font-normal ">→</span>
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
