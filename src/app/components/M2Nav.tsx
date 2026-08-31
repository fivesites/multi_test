"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useSound } from "@/context/SoundContext";
import VolumeSlider from "./VolumeSlider";
import CheckButton from "./CheckButton";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/connect", label: "Connect" },
  { href: "/studio", label: "Log In" },
] as const;

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
  onNavigate: () => void;
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
      className="p-6 space-y-0 w-full lg:w-1/4 bg-secondary "
    >
      <nav className="hidden lg:flex w-full flex-col gap-y-0 ">
        {NAV_ITEMS.map((item) => (
          <CheckButton
            className="font-visual text-xs font-normal tracking-wide text-primary pb-0x"
            size="sm"
            baseline={false}
            key={item.href}
            label={item.label}
            href={item.href}
            active={isActive(pathname, item.href)}
            onClick={onNavigate}
          />
        ))}
      </nav>
      <nav className="flex lg:hidden  w-full flex-col gap-y-0  ">
        {NAV_ITEMS.map((item) => (
          <CheckButton
            className="font-visual text-xl lg:text-3xl font-thin border  -mt-px lowercase pb-0"
            size="md"
            hoverFill
            baseline={false}
            key={item.href}
            label={item.label}
            href={item.href}
            active={isActive(pathname, item.href)}
            onClick={onNavigate}
          />
        ))}
      </nav>
      <CheckButton
        className=" flex lg:hidden font-visual text-xl lg:text-3xl font-thin  border lowercase pb-0 -mt-px "
        size="md"
        baseline={false}
        label="Settings"
        active={settingsOpen}
        onClick={onOpenSettings}
      />
      <CheckButton
        className="hidden lg:flexfont-visual text-xs font-normal tracking-wide text-primary pb-0 "
        size="sm"
        baseline={false}
        label="Settings"
        active={settingsOpen}
        onClick={onOpenSettings}
      />
      <SettingsVerticalOverlay />
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
      <div className="flex flex-col bg-background border p-4">
        <SettingsHeader
          label="Sound Settings"
          className="font-visual text-xs font-normal tracking-wide text-primary pb-2"
        />
        <CheckButton
          className="font-visual text-xs font-normal "
          size="sm"
          baseline={false}
          label={muted ? "Sound Off" : "Sound On"}
          active={!muted}
          onClick={toggleMute}
        />
        <VolumeSlider label="Volume" />
      </div>
      <div className="flex flex-col p-4 border gap-4">
        <SettingsHeader
          label="Color Settings"
          className="font-visual text-xs font-normal tracking-wide text-primary  pb-2"
        />
        <div className="grid grid-cols-2 grid-rows-3 gap-2">
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
  const [open, setOpen] = useState(true);
  const [openSettings, setOpenSettings] = useState(true);
  const { muted, toggleMute } = useSound();

  const toggleOpenNav = () => setOpen((o) => !o);
  const toggleOpenSettings = () => setOpenSettings((o) => !o);

  return (
    <div className="fixed top-0 left-0 z-90 w-full">
      <div className="flex items-center justify-between  px-6 h-16">
        <CheckButton
          tabIndex={0}
          className="font-visual text-xl lg:text-3xl font-thin pb-0  "
          terminal
          size="sm"
          baseline={true}
          label="multisquared"
          active={open}
          onClick={toggleOpenNav}
        />
        <CheckButton
          className="font-visual text-xl lg:text-3xl font-thin "
          size="sm"
          baseline={true}
          label={muted ? "sound off" : "sound on"}
          active={!muted}
          onClick={toggleMute}
        />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <NavVertical
            onNavigate={() => setOpen(false)}
            onOpenSettings={toggleOpenSettings}
            settingsOpen={openSettings}
          />
        )}
        {openSettings && <SettingsVerticalOverlay />}
      </AnimatePresence>
    </div>
  );
}
