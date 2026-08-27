"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useUI } from "@/context/UIContext";
import {
  Frame58,
  Frame71,
  Frame72,
  Square54,
  Square55,
  Square56,
  Square57,
  Square64,
} from "./marks";
import Link from "next/link";
import TerminalM2Button from "./TerminalM2Button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/connect", label: "Connect" },
  { href: "/studio", label: "Log In" },
] as const;

/** Routes that never call notifyContentDone (e.g. /studio) still have to settle. */
const READY_FALLBACK_MS = 2500;

function NavOverlay({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <div className="fixed top-0 left-0 z-30 flex lg:hidden h-dvh w-full flex-col justify-center gap-0 p-3 bg-accent">
      {NAV_ITEMS.map((item) => (
        <Button
          variant="nav"
          size="nav-lg"
          key={item.href}
          onClick={() => onNavigate(item.href)}
          className="px-0 text-primary underline-none hover:underline-none border-b border-b-primary hover:px-3 hover:bg-primary hover:text-primary-foreground transition-all  "
          asChild
        >
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
    </div>
  );
}

const MARK_CLASS = "block h-full w-full";

/** The resting mark: no artwork, just a filled square. */
function PlainSquare({ className }: { className?: string }) {
  return <div className={cn("bg-primary", className)} />;
}

/** Tapping the mark walks this list, wrapping at the end. */
const MARK_CYCLE = [
  PlainSquare,
  Square56,
  Square57,
  Square54,
  Square55,
  Square64,
  Frame58,
  Frame71,
  Frame72,
] as const;

/** Each route rests on its own mark; the cycle continues from there. */
const ROUTE_MARKS = [
  { match: "/about", mark: Square64 },
  { match: "/connect", mark: Square55 },
] as const;

/** Only the artwork is desaturated — the plain square keeps its fill. */
const isPlain = (i: number) => MARK_CYCLE[i] === PlainSquare;

function startIndex(pathname: string | null) {
  const route = ROUTE_MARKS.find((m) => pathname?.startsWith(m.match));
  const i = route ? MARK_CYCLE.indexOf(route.mark) : 0;
  return i < 0 ? 0 : i;
}

export default function MultiNav() {
  const pathname = usePathname();
  const { contentDoneKey } = useUI();
  // The mark's own state: which square in the cycle is showing.
  const [markIndex, setMarkIndex] = useState(() => startIndex(pathname));
  // Mobile's text menu, opened from the Menu button.
  const [open, setOpen] = useState(false);

  // "loading…" covers two things: the page's own intro typing hasn't finished
  // yet, and a route change is in flight.
  const [ready, setReady] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const loading = !ready || navigating;

  // A committed route change ends the pending navigation and puts the label
  // back into the waiting state until the new page reports in.
  useEffect(() => {
    setNavigating(false);
    setReady(false);
    // MultiNav lives in the layout, so the menu would otherwise survive the
    // route change that dismissed it; the mark falls back to the new route's.
    setMarkIndex(startIndex(pathname));
    setOpen(false);
    const t = setTimeout(() => setReady(true), READY_FALLBACK_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  // Home/About/Connect bump this once their content has finished typing.
  useEffect(() => {
    if (contentDoneKey > 0) setReady(true);
  }, [contentDoneKey]);

  const Mark = MARK_CYCLE[markIndex];

  function handleNavigate(href: string) {
    setOpen(false);
    if (href !== pathname) setNavigating(true);
  }

  return (
    <>
      <div className="fixed top-0 left-0 z-50 w-full      p-3  ">
        <div className="relative h-9 lg:h-9 flex border-b border-b-red-600  items-start gap-x-3 justify-between  lg:items-start">
          <div className="flex gap-x-1.5   lg:justify-start   lg:items-baseline">
            <button
              type="button"
              aria-label="Next square"
              onClick={() => setMarkIndex((i) => (i + 1) % MARK_CYCLE.length)}
              className="relative h-6 lg:h-6 aspect-square shrink-0 cursor-pointer"
            >
              <AnimatePresence initial={false}>
                <motion.span
                  key={markIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={cn(
                    "absolute inset-0",
                    !isPlain(markIndex) && "grayscale",
                  )}
                >
                  <Mark className={MARK_CLASS} />
                </motion.span>
              </AnimatePresence>
            </button>
            <h1 className="">
              <TerminalM2Button
                text="multi2.co"
                visible
                delay={0}
                loading={loading}
                loadingText="Loading"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              />
            </h1>
          </div>

          <nav className="flex gap-x-3">
            <Button
              className={`hidden lg:block   } `}
              variant="secondary"
              size="xs"
              asChild
            >
              <Link href="/">Home</Link>
            </Button>
            <Button
              className={` hidden lg:block   } `}
              variant="secondary"
              size="xs"
              asChild
            >
              <Link href="/projects">Projects</Link>
            </Button>
            <Button
              className={` hidden lg:block  } `}
              variant="secondary"
              size="xs"
              asChild
            >
              <Link href="/about">About</Link>
            </Button>
            <Button
              className={` hidden lg:block  }`}
              variant="secondary"
              size="xs"
              asChild
            >
              <Link href="/studio">Log In</Link>
            </Button>
            <Button
              className={` hidden lg:block  `}
              variant="default"
              size="xs"
              asChild
            >
              <Link href="/connect">Connect</Link>
            </Button>
          </nav>
          <Button
            variant="default"
            size="xs"
            className="lg:hidden block  "
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            Connect
          </Button>
        </div>
      </div>

      {open && <NavOverlay onNavigate={handleNavigate} />}
    </>
  );
}
