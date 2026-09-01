"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useSound } from "@/context/SoundContext";
import { useUI } from "@/context/UIContext";
import { useBusyCursor } from "@/context/CursorContext";
import VolumeSlider from "./VolumeSlider";
import CheckButton from "./CheckButton";
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
}: {
  onNavigate: (href: string) => void;
  onOpenSettings: () => void;
  settingsOpen: boolean;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`p-0 space-y-0 w-full lg:w-1/4 bg-secondary lg:bg-transparent flex flex-col h-dvh lg:h-auto`}
    >
      <nav className="hidden lg:flex w-full flex-col gap-y-0 lg:col-span-2">
        {NAV_ITEMS.map((item) => (
          <CheckButton
            className=" tracking-wide text-primary pb-0 font-visual lowercase     w-full"
            size="lg"
            key={item.href}
            label={item.label}
            href={item.href}
            active={isActive(pathname, item.href)}
            onClick={() => onNavigate(item.href)}
          />
        ))}
      </nav>
      <nav className="flex lg:hidden  w-full flex-col gap-y-0 px-1  ">
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
      </nav>
      <span className="flex lg:hidden px-2  ">
        <CheckButton
          className="  lowercase pb-0 "
          size="lg"
          label="Settings"
          active={settingsOpen}
          onClick={onOpenSettings}
        />
      </span>
      <CheckButton
        className="hidden    lg:flex font-visual tracking-wide text-primary pb-0  text-xl lowercase whitespace-nowrap lg:text-3xl font-thin   w-full "
        size="lg"
        label="Settings"
        active={settingsOpen}
        onClick={onOpenSettings}
      />
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

/** One row per palette: the two swatch halves, and the class globals.css
 *  hangs the palette off. The swatches are literal colours rather than
 *  bg-primary/bg-secondary — token-based ones would restyle themselves on
 *  every theme change, so the red chip would look blue in the blue theme.
 *  Written out in full because Tailwind only emits classes it can find as
 *  complete strings in the source. */
const THEMES = [
  {
    id: "red",
    label: "Red",
    className: "multi2_red",
    swatch: [
      "bg-[oklch(0.628_0.2577_29.2339)]",
      "bg-[oklch(0.628_0.2577_29.2339)]/10",
    ],
  },
  {
    id: "blue",
    label: "Blue",
    className: "multi2_blue",
    swatch: [
      "bg-[oklch(0.452_0.3132_264.05)]",
      "bg-[oklch(0.452_0.3132_264.05)]/10",
    ],
  },
  {
    id: "green",
    label: "Green",
    className: "multi2_green",
    // The only pair that is two real colours rather than a colour and its
    // tint: pure green beside #003500.
    swatch: [
      "bg-[oklch(0.8664_0.2948_142.5)]",
      "bg-[oklch(0.285_0.097_142.5)]",
    ],
  },
  {
    id: "pink",
    label: "Pink",
    className: "multi2_pink",
    swatch: [
      "bg-[oklch(0.7017_0.3225_328.36)]",
      "bg-[oklch(0.7017_0.3225_328.36)]/10",
    ],
  },
  {
    id: "teal",
    label: "Teal",
    className: "multi2_teal",
    // Teal #008080 beside #CCFFFF, the same dark/light pairing as green.
    swatch: [
      "bg-[oklch(0.5431_0.0927_194.77)]",
      "bg-[oklch(0.965_0.0516_196.33)]",
    ],
  },
  {
    id: "bw",
    label: "B/W",
    className: "multi2_bw",
    swatch: ["bg-[oklch(0_0_0)]", "bg-[oklch(0_0_0)]/10"],
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
}: {
  label: string;
  active: boolean;
  swatch: readonly [string, string];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-x-3 w-full ${active ? "border" : "border border-transparent"}`}
    >
      <div
        className={`flex items-center gap-x-0 ${active ? "border-r" : "border-transparent"}`}
      >
        <div className={`h-6 w-3 ${swatch[0]}`} />
        <div className={`h-6 w-3 ${swatch[1]}`} />
      </div>
      <label className="shrink-0 cursor-pointer font-visual text-xs text-primary">
        {label}
      </label>
    </button>
  );
}

function SettingsVerticalOverlay({ className }: { className?: string }) {
  const { muted, toggleMute } = useSound();
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);

  // The class lives on <html>, so it outlives this panel unmounting — read it
  // back rather than assuming the default.
  useEffect(() => {
    const found = THEMES.find((t) =>
      document.documentElement.classList.contains(t.className),
    );
    setTheme(found?.id ?? DEFAULT_THEME);
  }, []);

  // Every class is set explicitly rather than just adding the new one: the
  // palettes are exclusive, and a leftover class would win on cascade order.
  function selectTheme(next: ThemeId) {
    for (const t of THEMES) {
      document.documentElement.classList.toggle(t.className, t.id === next);
    }
    setTheme(next);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`${className} fixed bottom-4 lg:top-24 right-0  lg:bottom-auto flex flex-col gap-4 p-4 w-full lg:w-1/4`}
    >
      {!muted && (
        <div className="grid grid-cols-2 lg:flex lg:flex-col gap-x-4 flex-col   pr-4 lg:p-4 border">
          <CheckButton
            className="lg:hidden font-visual font-thin lowercase text-xl whitespace-nowrap lg:text-3xl   "
            size="lg"
            label={muted ? "Sound Off" : "Sound On"}
            active={!muted}
            onClick={toggleMute}
          />
          <VolumeSlider label="Volume" />
        </div>
      )}
      <div className="flex flex-col p-4 border gap-4">
        <div className="grid grid-cols-3 lg:grid-cols-2 grid-rows-3 gap-2">
          {THEMES.map((t) => (
            <ColorButton
              key={t.id}
              label={t.label}
              swatch={t.swatch}
              active={theme === t.id}
              onClick={() => selectTheme(t.id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function M2Nav() {
  const pathname = usePathname();
  const { contentDoneKey } = useUI();
  const { muted, toggleMute } = useSound();

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

  // Home/About/Connect bump this once their content has finished typing.
  useEffect(() => {
    if (contentDoneKey > 0) setReady(true);
  }, [contentDoneKey]);

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
        className={`grid grid-cols-3 lg:grid-cols-12 gap-x-2 lg:gap-x-0 items-center justify-start   px-1 lg:px-0 h-16 lg:h-16 ${open ? "bg-secondary lg:bg-transparent" : "bg-transparent"}`}
      >
        <div className="col-start-1 lg:col-start-1 lg:col-span-2 flex items-center gap-x-3">
          {/* mobile menu button */}
          <CheckButton
            className="flex lg:hidden font-visual    w-full  "
            size="lg"
            label={open ? "close" : "menu"}
            active={open}
            onClick={() => setOpen((o) => !o)}
          />
          {/* desktopmenu button */}
          <CheckButton
            className="hidden   lg:flex     w-full  "
            size="lg"
            label={open ? "close menu" : "multisquared"}
            active={open}
            onClick={() => setOpen((o) => !o)}
          />
        </div>
        <CheckButton
          className="hidden col-start-11  col-span-2 lg:flex font-visual text-xl lg:text-3xl font-thin lg:justify-end  "
          size="md"
          label={muted ? "sound off" : "sound on"}
          active={!muted}
          onClick={toggleMute}
        />

        <TerminalM2Button
          className="hidden lg:col-start-6 lg:col-span-2 font-visual text-xl lg:text-3xl font-thin  text-primary text-left lg:text-center justify-start lg:justify-center px-5 pb-0.5 lg:px-4 lg:pb-1 h-14 items-center  lg:h-16 border"
          text="multisquared"
          visible
          delay={0}
          loading={loading}
          loadingText="Loading"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <NavVertical
            key="nav"
            onNavigate={handleNavigate}
            onOpenSettings={() => setOpenSettings((o) => !o)}
            settingsOpen={openSettings}
          />
        )}
        {openSettings && <SettingsVerticalOverlay key="settings" />}
      </AnimatePresence>
    </div>
  );
}
