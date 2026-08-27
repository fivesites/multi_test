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

  // One work entry per image, so the same client shows up many times.
  const clients = useMemo(
    () =>
      Array.from(
        new Set(items.map((i) => i.client).filter((c): c is string => !!c)),
      ).sort((a, b) => a.localeCompare(b)),
    [items],
  );

  return (
    <div className="w-full bg-background">
      <div className="relative flex min-h-dvh flex-col w-full px-0">
        {/* HERO */}
        <section className="relative z-10 mt-0 h-dvh w-full flex flex-col items-start justify-center lg:justify-end bg-black ">
          <div className="flex flex-col items-start justify-center lg:justify-start lg:items-center w-full font-visual text-4xl leading-tight font-light lg:leading-[0.77] tracking-normal text-red-600">
            {/* Its own container, so the wordmark measures against this box
                and not the viewport — and so container-type's layout
                containment stays off the section, whose fixed children still
                have to anchor to the viewport. */}
            <span className="block lg:hidden px-6">
              <TypedRotator
                words={["multi2.co", "we multiply what matters..."]}
              />
            </span>
            <div className="hidden lg:block @container w-full overflow-x-clip px-3">
              <h1 className="heroWordmark mb-0 text-center lg:text-left text-red-600">
                {/* One word, so the rotator types it in and holds it rather
                    than cycling — its invisible sizing copy keeps the line from
                    reflowing mid-type. */}
                multi2.co
              </h1>
            </div>
          </div>
        </section>
        {/* CLIENTS + ABOUT — stacked on mobile, two halves on desktop */}
        <section className="  relative z-10  w-full flex flex-col justify-start items-start  pt-3  gap-3 min-h-dvh ">
          <div className="w-full   p-3 flex flex-col gap-8 lg:gap-0 items-start justify-start  text-primary h-full">
            <AboutSectionText
              plainText={aboutEntry?.plainText ?? ""}
              text={aboutBody ?? undefined}
              className=" "
            />
          </div>

          <div className="  min-w-0 flex-col items-start justify-start gap-0 w-full p-3 h-dvh">
            <Button
              variant="link"
              size="xs"
              className=" px-0 font-diatype  text-primary  w-min whitespace-nowrap   "
              asChild
            >
              <Link href="/projects">Projects</Link>
            </Button>

            <div className="grid grid-cols-12 gap-x-3 w-full border-t border-primary pt-3 ">
              <div className="flex items-center justify-center font-diatype col-span-2 aspect-square bg-primary text-primary-foreground text-xs uppercase cursor-pointer">
                ATG
              </div>
              <div className="flex items-center justify-center font-diatype col-span-2 aspect-square bg-primary text-primary-foreground text-xs uppercase cursor-pointer">
                Jureskogs
              </div>
              <div className="flex items-center justify-center font-diatype col-span-2 aspect-square bg-primary text-primary-foreground text-xs uppercase cursor-pointer">
                BJÖRK & BERRIES
              </div>
              <Button
                variant="link"
                className=" mt-3 text-5xl font-thin lowercase text-primary  w-full text-right  col-span-6 px-6 justify-end whitespace-nowrap font-visual   "
                asChild
              >
                <Link href="/projects">See All Projects</Link>
              </Button>
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
