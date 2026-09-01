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
import Image from "next/image";
import AboutSectionText from "./components/AboutSectionText";
import { getCategoryLabel } from "@/lib/categories";
import LandningBlock from "./components/LandningBlock";

import HomeFooter from "./components/HomeFooter";

function HomeClientInner() {
  const { items } = useWork();
  const { notifyContentDone } = useUI();

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

  // Tells MultiNav the page has settled, so it can drop its "loading…" label.
  useEffect(() => {
    if (!revealed) return;
    notifyContentDone();
  }, [revealed, notifyContentDone]);

  // Mobile has room for one box at the bottom of the hero: the consent flow
  // owns it until there is nothing left to ask, then Connect takes over.
  // Desktop shows both — Connect on the left, consent bottom right.
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

  // The services badge under the ATG card. Deduped because two CMS slugs can
  // share a label (post-processing/post-production both read "Post-prod").
  const atgCategories = useMemo(() => {
    const seen = new Set<string>();
    return (atg?.categories ?? []).filter((c) => {
      const label = getCategoryLabel(c).toLowerCase();
      if (seen.has(label)) return false;
      seen.add(label);
      return true;
    });
  }, [atg]);

  // Falls back to the first media image for works that have no cover set.
  const atgCover = atg?.coverUrl ?? atg?.url;

  return (
    <div className="w-full bg-background ">
      <div className="relative flex min-h-dvh flex-col w-full px-0">
        {/* HERO + ABOUT share a wrapper. A sticky box can only travel inside
            its own containing block, so this wrapper's bottom edge is where
            the wordmark lets go — exactly where Selected Projects begins. */}
        <div className="relative flex flex-col w-full ">
          {/* HERO — the wordmark holds the bottom of the viewport on desktop
              while About scrolls over it. Pinned with top-0, not bottom-0: a
              bottom inset only ever pulls a box *up* into view, so it does
              nothing once the hero has scrolled past. The section is exactly
              one viewport tall with the wordmark on its bottom edge, so
              pinning its top to 0 puts the wordmark on the viewport floor.
              Mobile keeps the plain hero: no pin, no travel. */}
          <LandningBlock className="h-dvh content-center">
            {/* Its own container, so the wordmark measures against this box
                and not the viewport — and so container-type's layout
                containment stays off the section, whose fixed children still
                have to anchor to the viewport. */}
            <div className="grid grid-cols-4 items-center w-full font-visual text-4xl leading-tight font-light lg:leading-[0.77] tracking-normal ">
              <h2 className="col-start-3 lg:col-start-2 text-center  h2Text  font-thin text-primary">
                multisquared
              </h2>
            </div>
          </LandningBlock>
          {/* ABOUT — the last thing the pinned wordmark scrolls behind. */}
          <LandningBlock
            label="about us"
            href="/about"
            bg="bg-secondary text-primary"
            className="min-h-[75dvh] pt-3"
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
          className="min-h-[200dvh] px-5 pt-5 pb-5 lg:px-3 lg:pt-[25dvh]"
        >
          <div className="grid lg:grid-cols-12 grid-cols-4 gap-3 w-full">
            <h2 className="col-start-2 lg:col-start-4 col-span-5   h2Text  font-thin text-primary">
              experience our work
            </h2>
            {/* selected projects 1 */}
            <Link
              href="/projects"
              className="relative flex flex-col-reverse  mt-[25dvh]  gap-3 col-start-1 col-span-12  w-full"
            >
              <div className=" relative w-full px-1 lg:w-1/2 mx-auto aspect-square">
                <Image
                  src={atgCover}
                  alt={atg?.alt ?? "ATG"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* TEXT */}
              <span className="relative lg:grid grid-cols-12 flex flex-row items-baseline justify-between   lg:justify-start   w-full ">
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
          className="min-h-[75dvh] flex-col items-center justify-center pt-3"
        >
          <div className="grid lg:grid-cols-12 grid-cols-4 gap-3 w-full">
            <h2 className="col-start-2 lg:col-start-4 col-span-8   h2Text  font-thin text-primary mb-4">
              lets start talking today
            </h2>
            <p className="text-primary pText col-start-2 lg:col-start-4 col-span-5 lg:col-span-8 ">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
              faucibus ex sapien vitae pellentesque sem placerat. In id cursus
              mi pretium tellus duis convallis.{" "}
            </p>
            <button className="mt-4 col-start-2 lg:col-start-4 col-span-5 lg:col-span-6 h3Text bg-primary text-primary-foreground lg:text-xl px-5 py-3 rounded-md">
              connect
            </button>
          </div>
        </LandningBlock>
      </div>
      <HomeFooter />
    </div>
  );
}

export default function HomeClient() {
  return <HomeClientInner />;
}
