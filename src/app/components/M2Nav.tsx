"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useSound } from "@/context/SoundContext";
import { useUI } from "@/context/UIContext";
import { useBusyCursor } from "@/context/CursorContext";
import { THEMES, useTheme, type ThemeId } from "@/context/ThemeContext";
import CheckButton from "./CheckButton";
import CheckToggle from "./CheckToggle";
import ThemeToggle from "./ThemeToggle";
import ColorButton from "./ColorButton";
import TerminalM2Button from "./TerminalM2Button";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/connect", label: "Connect" },
  { href: "/studio", label: "Log In" },
] as const;

/** Routes that never call notifyContentDone (e.g. /studio) still have to settle. */
const READY_FALLBACK_MS = 2500;

/** How far down the page counts as "the reader has moved on". */
const SCROLLED_PX = 40;

/** Home only matches exactly; the rest keep their mark on child routes too,
 *  so /projects/[slug] still reads as projects. */
function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavVertical({
  onNavigate,
  theme,
  onSelectTheme,
  dark,
  onToggleDark,
}: {
  onNavigate: (href: string) => void;
  theme: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  dark: boolean;
  onToggleDark: () => void;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      data-cursor-invert
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`p-0 space-y-0 w-full lg:w-full bg-primary pb-3 [&_*]:!text-primary-foreground flex flex-col h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-3rem)] pr-0 lg:pr-6 pixelCornersBottom lg:[mask-border:none] lg:[-webkit-mask-box-image:none]`}
    >
      <nav className="hidden lg:flex w-full flex-col gap-y-0 lg:col-span-2 ">
        {NAV_ITEMS.map((item) => (
          <CheckButton
            className="  text-primary pb-0 font-visual     w-full"
            size="lg"
            key={item.href}
            label={item.label}
            href={item.href}
            active={isActive(pathname, item.href)}
            onClick={() => onNavigate(item.href)}
          />
        ))}
      </nav>
      <nav className="flex lg:hidden  w-full flex-col gap-y-0 px-0  ">
        {NAV_ITEMS.map((item) => (
          <CheckButton
            className="f  lowercase pb-0"
            size="md"
            key={item.href}
            label={item.label}
            href={item.href}
            active={isActive(pathname, item.href)}
            onClick={() => onNavigate(item.href)}
          />
        ))}
      </nav>

      {/* The palette picker — one flick per theme, sliding to the one on. In
          the drawer at every width; the top bar keeps its compact swatch too. */}
      <ThemeToggle
        options={THEMES}
        value={theme}
        onChange={(id: string) => onSelectTheme(id as ThemeId)}
        className="w-full px-6 lg:px-3 py-3"
      />
      <CheckToggle
        offLabel="light"
        onLabel="dark"
        active={dark}
        onClick={onToggleDark}
        className="w-full px-6 lg:hidden"
      />
      {/* The wordmark, same as the footer's, pinned to the bottom of the
          drawer — bottom-left on mobile, bottom-right on desktop. */}
      <h1 className="h1Text leading-none mb-0 mt-auto self-start lg:self-end px-3 lg:px-6 pt-6">
        multi2.co
      </h1>
    </motion.div>
  );
}

export default function M2Nav() {
  const pathname = usePathname();
  const { contentDoneKey, setNavLoading } = useUI();
  const { muted, toggleMute } = useSound();
  const { theme, selectTheme, cycleTheme, dark, toggleDark } = useTheme();
  const currentTheme = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  // The column is opened from the menu button at every width.
  const [open, setOpen] = useState(false);

  // "loading…" covers two things: the page's own intro typing hasn't finished
  // yet, and a route change is in flight.
  const [ready, setReady] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const loading = !ready || navigating;
  // The nav already knows when the site is busy; the cursor cycles on the
  // same signal.
  useBusyCursor(loading);

  // A committed route change ends the pending navigation and puts the label
  // back into the waiting state until the new page reports in. M2Nav lives in
  // the layout, so the panels would otherwise survive the tap that dismissed
  // them.
  useEffect(() => {
    setNavigating(false);
    setReady(false);
    setOpen(false);
    const t = setTimeout(() => setReady(true), READY_FALLBACK_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  // Scrolling is its own answer to "is the page still loading?" — once the
  // reader has moved off the top the bar goes back to its own name, whether or
  // not the route ever reported in. Scoped to the label: `loading` still drives
  // the busy cursor until the page actually settles. Re-armed per route, and
  // read once on mount so a restored scroll position counts too.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    setScrolled(false);
    const onScroll = () => {
      if (window.scrollY > SCROLLED_PX) setScrolled(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Home/About/Connect bump this once their content has finished typing.
  useEffect(() => {
    if (contentDoneKey > 0) setReady(true);
  }, [contentDoneKey]);

  // "loading" wins over both: the bar reports the site's state before it
  // reports the menu's.
  const menuLoading = loading && !scrolled;

  // Published so pages can line their own intro typing up behind the bar's.
  useEffect(() => {
    setNavLoading(menuLoading);
  }, [menuLoading, setNavLoading]);

  const menuLabel = menuLoading ? "loading" : open ? "close" : "multisquared";

  // Past the top of the page, the closed menu button alternates "menu" and the
  // wordmark rather than sitting on one.
  const cycleMenuLabel = scrolled && !open && !menuLoading;

  function handleNavigate(href: string) {
    setOpen(false);
    if (href !== pathname) setNavigating(true);
  }

  // The nav is hidden on /studio.
  if (pathname?.startsWith("/studio")) return null;

  return (
    <div className="fixed top-0 left-0 z-90 w-full px-0 pt-0 lg:px-0">
      <div
        // The bar is transparent with text-primary throughout. Opening the menu
        // fills it with bg-primary and flips it to text-primary-foreground, so
        // the drawer that drops out of it reads as one surface.
        {...(open ? { "data-cursor-invert": "" } : {})}
        className={`grid grid-cols-3 lg:grid-cols-12 gap-x-0 lg:gap-x-0 items-baseline justify-start  px-0 pt-0   lg:px-0 h-16 lg:h-auto transition-colors ${
          open
            ? "bg-primary text-primary-foreground [&_*]:!text-primary-foreground"
            : "bg-transparent text-primary"
        }`}
      >
        {/* Mobile: one combined button in the bar — it types "menu"/"close",
            reports "loading", and cycles the wordmark once scrolled. The label
            rides in as a child because CheckButton's own `terminal` flag can't
            pass the loading state through; keyed so each change retypes. */}
        <CheckButton
          className="lg:hidden col-start-1 col-span-2 flex font-visual w-full"
          size="lg"
          label={menuLabel}
          active
          onClick={() => setOpen((o) => !o)}
        >
          <TerminalM2Button
            className="tracking-wide"
            key={menuLabel}
            text={open ? "close" : "menu"}
            visible
            delay={0}
            loading={menuLoading}
            loadingText="loading"
            phrases={cycleMenuLabel ? ["loading", "multi2.co"] : []}
            loop={cycleMenuLabel}
            trigger={cycleMenuLabel ? "scrolled" : "idle"}
          />
        </CheckButton>

        {/* Desktop col-1: the logo/loading button. Types "loading" while the
            site settles, then the wordmark; clicking it scrolls back to top. */}
        <CheckButton
          className="hidden lg:flex lg:col-start-1 lg:col-span-2 font-visual w-full"
          size="lg"
          label={menuLoading ? "loading" : "multisquared"}
          active
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <TerminalM2Button
            className="tracking-wide"
            key={menuLoading ? "loading" : "wordmark"}
            text="multisquared"
            visible
            delay={0}
            loading={menuLoading}
            loadingText="loading"
            // Once the reader has scrolled, the button keeps cycling between
            // "loading" and the wordmark so the bar still says who it is.
            phrases={cycleMenuLabel ? ["loading", "multi2.co"] : []}
            loop={cycleMenuLabel}
            trigger={cycleMenuLabel ? "scrolled" : "idle"}
          />
        </CheckButton>

        {/* Mobile: the sound toggle sits in the bar's spare third column,
            pushed to the top-right corner. */}
        <CheckButton
          className="lg:hidden col-start-3 col-span-1 font-visual justify-end"
          size="lg"
          label={muted ? "sound off" : "sound on"}
          active={!muted}
          onClick={toggleMute}
        />

        {/* Desktop col-4: a plain menu/close toggle for the nav drawer. */}
        <CheckButton
          className="hidden lg:flex lg:col-start-4 lg:col-span-2 font-visual w-full"
          size="lg"
          label={open ? "close" : "menu"}
          active={open}
          onClick={() => setOpen((o) => !o)}
        />

        <CheckButton
          className="hidden lg:flex lg:col-start-7 lg:col-span-2 font-visual lg:justify-start"
          size="lg"
          label={muted ? "sound off" : "sound on"}
          active={!muted}
          onClick={toggleMute}
        />

        {/* Desktop: the dark toggle and the palette swatch sit at the far end
            of the bar. */}
        <CheckToggle
          offLabel="light"
          onLabel="dark"
          active={dark}
          onClick={toggleDark}
          className="hidden lg:flex lg:col-start-9 lg:col-span-2 justify-end"
        />
        <ColorButton
          label={currentTheme.label}
          swatch="text-primary"
          active
          onClick={cycleTheme}
          className="hidden lg:flex lg:col-start-12 justify-end"
        />
      </div>

      {/* The panel unfolds as a drawer — the wrapper animates its height so the
          menu slides down from under the bar, and NavVertical eases in behind
          it. Mirrors the bottom drawer on /projects. */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="nav-drawer"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <NavVertical
              onNavigate={handleNavigate}
              theme={theme}
              onSelectTheme={selectTheme}
              dark={dark}
              onToggleDark={toggleDark}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
