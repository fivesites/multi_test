"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import { useCopyEntry, useCopyBody } from "@/context/CopyContext";
import Link from "next/link";
import AboutSectionText from "./components/AboutSectionText";
import LandningBlock from "./components/LandningBlock";
import PixelFrame from "./components/PixelFrame";
import TypedHeading from "./components/TypedHeading";
import { Button } from "@/components/ui/button";

import HomeFooter from "./components/Footer";

function HomeClientInner() {
  const { items } = useWork();
  const { notifyContentDone, navLoading } = useUI();

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
    <div className="w-full bg-background px-3 lg:px-6">
      <div className="relative flex min-h-dvh flex-col w-full ">
        <LandningBlock className="h-dvh content-center">
          {/* Its own container, so the wordmark measures against this box
                and not the viewport — and so container-type's layout
                containment stays off the section, whose fixed children still
                have to anchor to the viewport. */}
          <h1 className="grid grid-cols-4 items-center w-full">
            {/* Held back until the bar has stopped saying "loading", so the
                two aren't typing at each other. */}
            <TypedHeading
              ready={!navLoading}
              text="multisquared"
              className="col-start-2 lg:col-start-2 text-left  h2Text  font-thin text-primary"
            />
          </h1>
        </LandningBlock>
        <div className="grid grid-cols-12 ">
          <LandningBlock
            label="about us"
            href="/about"
            bg="bg-secondary   text-primary "
            className="col-start-1 col-span-12 lg:col-start-3 lg:col-span-8 h-dvh    lg:h-[80dvh]  "
          >
            <AboutSectionText
              plainText={aboutEntry?.plainText ?? ""}
              text={aboutBody ?? undefined}
              className="w-full justify-center lg:content-center lg:pb-6"
            />
          </LandningBlock>
        </div>
      </div>

      <div className="grid grid-cols-12 ">
        <LandningBlock
          label="selected projects"
          href="/projects"
          className="min-h-[100dvh] lg:h-[50dvh]  px- col-start-1 lg:col-start-3 col-span-12 lg:col-span-8 bg-background px-0   "
        >
          {/* Same four/eight-column grid the block's label sits on, so the
              heading lines up under "selected projects" in column two. */}
          <div className="grid grid-cols-4 lg:grid-cols-8 w-full">
            <TypedHeading
              text="experience our work"
              className="mb-12 h2Text flex col-start-2 col-span-3 lg:col-start-2 lg:col-span-6 font-thin text-primary"
            />
          </div>
        </LandningBlock>
      </div>
      {/* The featured works as their own grid: one per row on mobile,
              three per row on desktop, under the heading. */}
      <div className="grid grid-cols-12">
        <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10 grid grid-cols-1 lg:grid-cols-6 gap-3 mb-12">
          {featuredProjects.map((project) => (
            <Link
              key={project.key}
              href={`/projects/${project.slug}`}
              className="col-span-2 bg-background pixelCorners  group relative flex flex-col gap-3 w-full mb-6 "
            >
              <PixelFrame
                src={project.coverUrl ?? project.url}
                alt={project.alt}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="w-full aspect-square"
              />

              <h3 className=" h3Text text-primary px-6 mb-6 lg:mb-0 lowercase indent-[calc(25vw-1.8rem)] lg:indent-0">
                {project.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
      <LandningBlock
        label="connect with us"
        href="/connect"
        bg="bg-secondary text-primary"
        className="lg:h-auto h-dvh flex-col items-center justify-center pt-3 w-full"
        // The content sits on its own 12-column grid starting at column 4
        // (25%). Column 3 of the block's 8-column grid is the same 25%, so the
        // label lines up above the heading, copy and button.
        labelClassName="col-start-2 col-span-3 lg:col-start-3 lg:col-span-4"
      >
        <div className="grid lg:grid-cols-12 grid-cols-4 items-center justify-center gap-3 w-full">
          <TypedHeading
            text="lets start talking today"
            className="col-start-2 lg:col-start-4 col-span-3 lg:col-span-8   h2Text  font-thin text-primary mb-4"
          />
          <p className="text-primary pText col-start-1 lg:col-start-4 col-span-4 indent-[calc(25vw-1.5rem)] lg:indent-0 px-6 lg:px-0 lg:col-span-8 py-5 lg:p-0 lowercase ">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis.{" "}
          </p>
          <span className="col-start-1 lg:col-start-4 col-span-4 px-6 lg:x-0 mt-0 lg:mt-12 pb-6 lg:col-span-2 flex items-centerjustify-center ">
            <Button size="lg" className="  w-full  ">
              connect{" "}
            </Button>
          </span>
          <span className="hidden lg:flex lg:col-start-6 px-0 mt-6 pb-6 lg:col-span-2 items-center justify-center ">
            <Button size="lg" variant="outline" className="  w-full  ">
              continue to projects
            </Button>
          </span>
        </div>
      </LandningBlock>

      <HomeFooter />
    </div>
  );
}

export default function HomeClient() {
  return <HomeClientInner />;
}
