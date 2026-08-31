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
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import TypedRotator from "./components/TypedRotator";
import AboutSectionText from "./components/AboutSectionText";
import { getCategoryLabel } from "@/lib/categories";

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

  // One work entry per image, so the same client shows up many times.
  const clients = useMemo(
    () =>
      Array.from(
        new Set(items.map((i) => i.client).filter((c): c is string => !!c)),
      ).sort((a, b) => a.localeCompare(b)),
    [items],
  );

  return (
    <div className="w-full bg-secondary ">
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
          <section className="relative z-10 h-dvh  flex flex-col items-start justify-center lg:justify-end   ">
            <div className="flex flex-col items-center justify-center lg:justify-start lg:items-center w-full font-visual text-4xl leading-tight font-light lg:leading-[0.77] tracking-normal text-red-600">
              {/* Its own container, so the wordmark measures against this box
                and not the viewport — and so container-type's layout
                containment stays off the section, whose fixed children still
                have to anchor to the viewport. */}
              <span className="block lg:hidden px-6 text-center">
                <TypedRotator
                  className="text-center"
                  words={["multi2.co", "we multiply what matters..."]}
                />
              </span>
              <div className="hidden  @container w-full overflow-x-clip px-3">
                <h1 className="heroWordmark mb-0 text-center lg:text-left text-primary">
                  {/* One word, so the rotator types it in and holds it rather
                    than cycling — its invisible sizing copy keeps the line from
                    reflowing mid-type. */}
                  multi2.co
                </h1>
              </div>
            </div>
          </section>
          {/* ABOUT — the last thing the pinned wordmark scrolls behind. */}
          <section className="  relative z-10  w-full flex flex-col justify-start items-start  pt-3  gap-3 min-h-dvh ">
            <div className="w-full   p-3 flex flex-col gap-8 lg:gap-0 items-start justify-start  text-primary h-full">
              <AboutSectionText
                plainText={aboutEntry?.plainText ?? ""}
                text={aboutBody ?? undefined}
                className=" "
              />
            </div>
          </section>
        </div>

        {/* SELECTED PROJECTS — outside the wrapper, so arriving here is what
            releases the wordmark. */}
        <section className="  relative z-10  w-full flex flex-col justify-start items-start  pt-3  gap-3 ">
          <div className="  min-w-0 flex-col items-start justify-start gap-0 w-full p-3 ">
            <h3 className="h3Text lg:pText text-primary mb-1.5   ">
              Selected Projects
            </h3>

            <div className="lg:grid flex flex-col   gap-x-3 w-full border-t border-primary  pt-3 lg:grid-cols-12 gap-3 ">
              {/* BOX */}
              <Link
                href="/projects"
                className="flex flex-col lg:flex-row-reverse  gap-3 lg:col-span-12  w-full"
              >
                {/* TEXT */}
                <span className="flex flex-col lg:flex-col-reverse lg:items-start lg:justify-between w-full">
                  <h2 className="h2Text text-primary max-w-sm mb-3 lg:mb-0 lg:max-w-xl lg:p-3  ">
                    When We Multiplied the Potential Winners for ATG
                  </h2>{" "}
                  <span className="flex  gap-y-0 flex-col lg:flex-row justify-between items-start w-full">
                    <h3 className=" h3Text text-primary  ">ATG</h3>
                    <div className="hidden lg:flex flex-wrap uppercase items-start justify-end gap-x-2">
                      {atgCategories.map((c) => (
                        <h3 key={c} className="h3Text  text-primary  ">
                          {getCategoryLabel(c)}
                        </h3>
                      ))}
                    </div>
                  </span>
                </span>
                {/* `fill` needs a positioned box to measure against, and the
                    aspect ratio has to live on that box so the square holds
                    while the image is still loading. */}
                <div className="relative w-full aspect-square overflow-hidden bg-primary max-w-1/3">
                  {atgCover ? (
                    <Image
                      src={atgCover}
                      alt={atg?.alt ?? "ATG"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-diatype text-primary-foreground text-xs uppercase">
                      ATG
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <HomeFooter />
    </div>
  );
}

type SubscribeStatus = "idle" | "submitting" | "done" | "error";

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    try {
      // The route 501s until NEWSLETTER_ENDPOINT is set — see
      // src/app/api/newsletter/route.ts.
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative z-10 min-h-dvh w-full flex flex-col justify-center gap-8 px-6 py-24 lg:px-6">
      <div className="flex flex-col gap-3">
        <h3 className="btnText uppercase tracking-widest text-muted-foreground">
          Newsletter
        </h3>
        <h2 className="font-visual text-3xl lg:text-6xl font-thin lowercase leading-tight text-secondary-foreground max-w-2xl">
          What we make, once in a while.
        </h2>
      </div>

      {status === "done" ? (
        <p className="tracking-wide font-diatype text-base lg:text-lg text-secondary-foreground">
          You&apos;re on the list. Talk soon.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-3 w-full max-w-xl"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email
          </label>
          <Input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={status === "error"}
            className="lg:h-14 bg-chart-1 border-transparent"
          />
          <Button
            type="submit"
            size="lg"
            disabled={status === "submitting"}
            className="btnText w-full lg:h-14 lg:w-48"
          >
            {status === "submitting" ? "Subscribing…" : "Subscribe"}
          </Button>
        </form>
      )}

      {status === "error" && (
        <p role="status" className="btnText text-destructive">
          That didn&apos;t go through. Try again in a moment.
        </p>
      )}
    </section>
  );
}

export default function HomeClient() {
  return <HomeClientInner />;
}
