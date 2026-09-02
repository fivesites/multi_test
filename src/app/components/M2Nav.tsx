"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useSound } from "@/context/SoundContext";
import { useUI } from "@/context/UIContext";
import { useBusyCursor } from "@/context/CursorContext";
import VolumeSlider from "./VolumeSlider";
import CheckButton from "./CheckButton";
import TerminalM2Button from "./TerminalM2Button";
import SettingsOverlay from "./SettingsOverlay";
import { Loading5 } from "./marks";

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
  onOpenSettings,
  settingsOpen,
  theme,
  onCycleTheme,
}: {
  onNavigate: (href: string) => void;
  onOpenSettings: () => void;
  settingsOpen: boolean;
  theme: ThemeId;
  onCycleTheme: () => void;
}) {
  const pathname = usePathname();
  // The swatch always shows the palette that is on; tapping it steps to the
  // next one, so the row doubles as the readout and the control.
  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`p-0 space-y-0 w-full lg:w-1/4 bg-secondary lg:bg-transparent flex flex-col h-dvh lg:h-auto px-1.5 lg:px-6`}
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
            size="lg"
            key={item.href}
            label={item.label}
            href={item.href}
            active={isActive(pathname, item.href)}
            onClick={() => onNavigate(item.href)}
          />
        ))}
        <ColorButton
          label={current.label}
          swatch={current.swatch}
          active
          onClick={onCycleTheme}
        />
      </nav>
    </motion.div>
  );
}

function SettingsHeader({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className="flex items-center h-6 border-b border-primary">
      <h3 className={className}>{label}</h3>
    </div>
  );
}

/** One row per palette: the colour its mark is drawn in, and the class
 *  globals.css hangs the palette off. The swatch is a literal colour rather
 *  than text-primary — a token-based one would restyle itself on every theme
 *  change, so the red mark would look blue in the blue theme. Written out in
 *  full because Tailwind only emits classes it can find as complete strings in
 *  the source. */
const THEMES = [
  {
    id: "red",
    label: "Red",
    className: "multi2_red",
    swatch: "text-[oklch(0.628_0.2577_29.2339)]",
  },
  {
    id: "blue",
    label: "Blue",
    className: "multi2_blue",
    swatch: "text-[oklch(0.452_0.3132_264.05)]",
  },
  {
    id: "green",
    label: "Green",
    className: "multi2_green",
    // The one palette whose primary is the dark half rather than the saturated
    // one — taking the bright green here would paint the mark in this theme's
    // own background colour.
    swatch: "text-[oklch(0.285_0.097_142.5)]",
  },
  {
    id: "pink",
    label: "Pink",
    className: "multi2_pink",
    swatch: "text-[oklch(0.7017_0.3225_328.36)]",
  },
  {
    id: "teal",
    label: "Teal",
    className: "multi2_teal",
    swatch: "text-[oklch(0.5431_0.0927_194.77)]",
  },
  {
    id: "bw",
    label: "B/W",
    className: "multi2_bw",
    swatch: "text-[oklch(0_0_0)]",
  },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

/** The bare :root is already the red palette, so nothing is set until asked. */
const DEFAULT_THEME: ThemeId = "red";

function ColorButton({
  label,
  active,
  swatch,
  onClick,
  className = "",
  labelSide,
}: {
  label: string;
  active: boolean;
  swatch: string;
  onClick: () => void;
  className?: string;
  /** Which side of the swatch the label sits on. Omit to keep it hidden. */
  labelSide?: "left" | "right";
}) {
  // Counted up rather than wrapped at 4, so the mark keeps turning the same
  // way instead of snapping back to zero on every fourth click.
  const [turns, setTurns] = useState(0);

  const labelEl = labelSide ? (
    <span className="shrink-0 cursor-pointer font-visual text-lg font-normal tracking-wide lowercase text-primary">
      {label}
    </span>
  ) : null;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={() => {
        setTurns((t) => t + 1);
        onClick();
      }}
      className={`flex cursor-pointer items-center bg-transparnet gap-x-3 w-full px-3 lg:px-3 h-12 lg:h-12 ${className}`}
    >
      {labelSide === "left" && labelEl}
      {/* The mark draws in currentColor, so the palette's colour rides in as a
          text colour. The quarter turn sits on a wrapper: the svg is inline,
          so it needs a block box of its own to rotate about its own centre. */}
      <motion.span
        className="flex shrink-0"
        animate={{ rotate: turns * 90 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Loading5 className={`h-3 w-3 ${swatch}`} />
      </motion.span>
      {labelSide === "right" && labelEl}
    </button>
  );
}

/** Owned by M2Nav rather than by either panel: the nav column and the settings
 *  overlay are on screen together, so a copy of this state in each would let
 *  one of them fall out of step with the class actually on <html>. */
function useTheme() {
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);

  // The class lives on <html>, so it outlives any panel unmounting — read it
  // back rather than assuming the default.
  useEffect(() => {
    const found = THEMES.find((t) =>
      document.documentElement.classList.contains(t.className),
    );
    setTheme(found?.id ?? DEFAULT_THEME);
  }, []);

  // Every class is set explicitly rather than just adding the new one: the
  // palettes are exclusive, and a leftover class would win on cascade order.
  const selectTheme = useCallback((next: ThemeId) => {
    for (const t of THEMES) {
      document.documentElement.classList.toggle(t.className, t.id === next);
    }
    setTheme(next);
  }, []);

  const cycleTheme = useCallback(() => {
    const i = THEMES.findIndex((t) => t.id === theme);
    selectTheme(THEMES[(i + 1) % THEMES.length].id);
  }, [theme, selectTheme]);

  return { theme, selectTheme, cycleTheme };
}

export default function M2Nav() {
  const pathname = usePathname();
  const { contentDoneKey, setNavLoading, filtersOpen, setFiltersOpen } =
    useUI();
  const { muted, toggleMute } = useSound();
  const { theme, cycleTheme } = useTheme();
  // The swatch shows the palette that is on; clicking it steps to the next one.
  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  // The column is opened from the menu button at every width.
  const [open, setOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

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
    setOpenSettings(false);
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

  // The settings menu only carries the projects view toggles for now, so it
  // rides along only on that page.
  const onProjects = pathname === "/projects";

  function handleNavigate(href: string) {
    setOpen(false);
    if (href !== pathname) setNavigating(true);
  }

  return (
    <div className="fixed top-0 left-0 z-90 w-full">
      <div
        // Opening the menu fills the bar on mobile, where the panel drops
        // straight out of it and the two read as one surface. Desktop keeps the
        // bar transparent throughout: the column below carries its own ground,
        // so filling the bar too would box the page in.
        className={`grid grid-cols-4 lg:grid-cols-12 gap-x-0 lg:gap-x-0 items-center justify-start  px-1.5   lg:px-6 h-12 lg:h-24 ${open ? "bg-secondary lg:bg-transparent" : "bg-transparent"}`}
      >
        <div className="col-start-1 lg:col-start-1 lg:col-span-2 flex items-center gap-x-3 t">
          {/* The label rides in as a child rather than through CheckButton's
              own `terminal` flag, which has no way to pass the loading state
              through. Keyed on the label so each change remounts and retypes
              instead of swapping the letters in place. */}
          <CheckButton
            className="flex font-visual w-full"
            size="lg"
            label={menuLabel}
            active={open}
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
            />
          </CheckButton>
        </div>
        <CheckButton
          className="hidden col-start-4  col-span-2 lg:flex font-visual  lg:justify-start  "
          size="label"
          label={muted ? "sound off" : "sound on"}
          active={!muted}
          onClick={toggleMute}
        />
        {/* Projects only. Mobile: a fixed button in the bottom-left corner that
            opens the full-screen filter/settings sheet. Desktop: sits in the
            bar at column ten with the settings menu dropping straight below. */}
        {onProjects && (
          <div className="fixed bottom-3 left-3 z-[95] flex flex-col items-start lg:relative lg:bottom-auto lg:left-auto lg:z-auto lg:col-start-10 lg:col-span-2 lg:h-full lg:justify-center">
            <CheckButton
              className="lg:hidden flex font-visual pixelCorners px-6 bg-secondary w-full text-secondary-foreground"
              size="lg"
              label="filter settings"
              active={filtersOpen}
              onClick={() => setFiltersOpen((v) => !v)}
            />
            <CheckButton
              className="hidden lg:flex font-visual lg:justify-start"
              size="label"
              label="settings"
              active={openSettings}
              onClick={() => setOpenSettings((o) => !o)}
            />
            <AnimatePresence initial={false}>
              {openSettings && (
                <SettingsOverlay
                  key="settings"
                  className="hidden lg:flex absolute left-0 top-full z-[95] w-full"
                />
              )}
            </AnimatePresence>
          </div>
        )}
        {/* The palette swatch, top-right corner — clicking it cycles the
            theme. */}
        <ColorButton
          label={current.label}
          swatch={current.swatch}
          active
          onClick={cycleTheme}
          className="col-start-4 col-span-1 flex justify-end lg:col-start-12 lg:col-span-2 lg:justify-end"
        />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <NavVertical
            key="nav"
            onNavigate={handleNavigate}
            onOpenSettings={() => setOpenSettings((o) => !o)}
            settingsOpen={openSettings}
            theme={theme}
            onCycleTheme={cycleTheme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
