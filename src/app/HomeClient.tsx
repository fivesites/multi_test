"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import { useCopyEntry, useCopyBody } from "@/context/CopyContext";
import Link from "next/link";
import AboutSectionText from "./components/AboutSectionText";
import { getCategoryLabel } from "@/lib/categories";
import LandningBlock from "./components/LandningBlock";
import PixelFrame from "./components/PixelFrame";
import TypedHeading from "./components/TypedHeading";
import { Button } from "@/components/ui/button";

import HomeFooter from "./components/HomeFooter";

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

  const [consentSettled, setConsentSettled] = useState(false);
  const settleConsent = useCallback(() => setConsentSettled(true), []);

  const aboutEntry = useCopyEntry("about-intro");
  const aboutBody = useCopyBody("about-intro");

  // ATG's cover is a separate asset from its media images, so it comes off
  // `coverUrl` rather than the item's `url`. The primary item is the one
  // carrying the work-level fields.
  const atg = useMemo(
    () => items.find((i) => i.client === "ATG" && i.isPrimary),
    [items],
  );

  // Falls back to the first media image for works that have no cover set.
  const atgCover = atg?.coverUrl ?? atg?.url;

  return (
    <div className="w-full bg-background px-1.5 lg:px-3 ">
      <div className="relative flex min-h-dvh flex-col w-full ">
        <LandningBlock className="h-dvh content-center">
          {/* Its own container, so the wordmark measures against this box
                and not the viewport — and so container-type's layout
                containment stays off the section, whose fixed children still
                have to anchor to the viewport. */}
          <div className="grid grid-cols-4 items-center w-full">
            {/* Held back until the bar has stopped saying "loading", so the
                two aren't typing at each other. */}
            <TypedHeading
              ready={!navLoading}
              text="multisquared"
              className="col-start-3 lg:col-start-2 text-center  h2Text  font-thin text-primary"
            />
          </div>
        </LandningBlock>

        <LandningBlock
          label="about us"
          href="/about"
          bg="bg-secondary text-primary"
          className="  "
        >
          <AboutSectionText
            plainText={aboutEntry?.plainText ?? ""}
            text={aboutBody ?? undefined}
            className="w-full justify-center lg:content-center"
          />
        </LandningBlock>
      </div>

      <LandningBlock
        label="selected projects"
        href="/projects"
        className="min-h-[200dvh] px-0"
      >
        <div className="grid lg:grid-cols-12 grid-cols-4 gap-3 w-full">
          <TypedHeading
            text="experience our work"
            className="col-start-2 lg:col-start-4 col-span-5   h2Text  font-thin text-primary"
          />
          {/* selected projects 1 */}
          <Link
            href="/projects"
            className="relative flex flex-col   gap-3 col-start-1 col-span-4   w-full"
          >
            <PixelFrame
              src={atgCover}
              alt={atg?.alt ?? "ATG"}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full px-1  mx-auto aspect-square"
            />
            {/* TEXT */}
            <span className="relative flex flex- items-baseline justify-between   lg:justify-start   w-full ">
              <h3 className="col-start-4 h3Text text-primary max-w-sm mb-0 px-2 lg:mb-0 lg:max-w-xl  lg:px-3 lg:pt-6 lg:pb-4 lowercase  ">
                Generating Wins
              </h3>{" "}
              <h3 className=" col-start-8 h3Text text-primary px-5 lg:px-3 space-x-3 ">
                jureskogs
              </h3>
            </span>
          </Link>
        </div>
      </LandningBlock>
      <LandningBlock
        label="connect with us"
        href="/connect"
        bg="bg-secondary text-primary"
        className="min-h-[75dvh] flex-col items-center justify-center pt-3 w-full"
      >
        <div className="grid lg:grid-cols-12 grid-cols-4 items-center justify-center gap-3 w-full">
          <TypedHeading
            text="lets start talking today"
            className="col-start-2 lg:col-start-4 col-span-8   h2Text  font-thin text-primary mb-4"
          />
          <p className="text-primary pText col-start-1 lg:col-start-4 col-span-4 lg:col-span-8 p-5 lg:p-0 ">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis.{" "}
          </p>
          {/* Full-bleed on mobile: the cell already covers all four columns,
              so the side padding is what has to go for the button to reach
              them. Desktop keeps it, where col-span-6 sets the width instead. */}
          <span className="mt-4 flex lg:col-start-4 col-span-4 lg:col-span-6 items-center justify-center p-5">
            <Button size="lg" className="  w-full   ">
              connect
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
