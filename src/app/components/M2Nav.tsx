"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useSound } from "@/context/SoundContext";
import { useUI } from "@/context/UIContext";
import { useBusyCursor } from "@/context/CursorContext";
import VolumeSlider from "./VolumeSlider";
import CheckButton from "./CheckButton";
import CheckToggle from "./CheckToggle";
import ThemeToggle from "./ThemeToggle";
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
  onSelectTheme,
  dark,
  onToggleDark,
}: {
  onNavigate: (href: string) => void;
  onOpenSettings: () => void;
  settingsOpen: boolean;
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
      className={`flex cursor-pointer items-center bg-transparnet gap-x-3 w-full px-6 lg:px-3 h-16 lg:h-12 ${className}`}
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
const THEME_STORAGE_KEY = "multi2-theme";

/** Dark mode rides alongside the palette: `multi2_dark` is added next to the
 *  `multi2_*` class, and globals.css has a two-class block per palette that
 *  inverts it. */
const DARK_STORAGE_KEY = "multi2-dark";
const DARK_CLASS = "multi2_dark";

function useTheme() {
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [dark, setDark] = useState(false);

  // Source of truth is the saved choice; the <html> class is just how it's
  // applied. Fall back to whatever class is already on <html> (the pre-paint
  // script), then to red.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {}
    const fromStore = THEMES.find((t) => t.id === stored)?.id;
    const fromClass = THEMES.find((t) =>
      document.documentElement.classList.contains(t.className),
    )?.id;
    const next = fromStore ?? fromClass ?? DEFAULT_THEME;
    for (const t of THEMES) {
      document.documentElement.classList.toggle(t.className, t.id === next);
    }
    setTheme(next);

    let storedDark: string | null = null;
    try {
      storedDark = localStorage.getItem(DARK_STORAGE_KEY);
    } catch {}
    const isDark =
      storedDark === "1" ||
      document.documentElement.classList.contains(DARK_CLASS);
    document.documentElement.classList.toggle(DARK_CLASS, isDark);
    setDark(isDark);
  }, []);

  // Every class is set explicitly rather than just adding the new one: the
  // palettes are exclusive, and a leftover class would win on cascade order.
  const selectTheme = useCallback((next: ThemeId) => {
    for (const t of THEMES) {
      document.documentElement.classList.toggle(t.className, t.id === next);
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
    setTheme(next);
  }, []);

  const cycleTheme = useCallback(() => {
    const i = THEMES.findIndex((t) => t.id === theme);
    selectTheme(THEMES[(i + 1) % THEMES.length].id);
  }, [theme, selectTheme]);

  const toggleDark = useCallback(() => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle(DARK_CLASS, next);
      try {
        localStorage.setItem(DARK_STORAGE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }, []);

  return { theme, selectTheme, cycleTheme, dark, toggleDark };
}

export default function M2Nav() {
  const pathname = usePathname();
  const { contentDoneKey, setNavLoading, filtersOpen, setFiltersOpen } =
    useUI();
  const { muted, toggleMute } = useSound();
  const { theme, selectTheme, cycleTheme, dark, toggleDark } = useTheme();
  const currentTheme = THEMES.find((t) => t.id === theme) ?? THEMES[0];

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

  // Past the top of the page, the closed menu button alternates "menu" and the
  // wordmark rather than sitting on one.
  const cycleMenuLabel = scrolled && !open && !menuLoading;

  // The settings menu only carries the projects view toggles for now, so it
  // rides along only on that page.
  const onProjects = pathname === "/projects";

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
              onOpenSettings={() => setOpenSettings((o) => !o)}
              settingsOpen={openSettings}
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
