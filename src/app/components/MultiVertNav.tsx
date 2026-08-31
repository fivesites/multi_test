"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useReel } from "@/context/ReelContext";
import { useSound } from "@/context/SoundContext";
import { cn } from "@/lib/utils";
import { BlackOnGreen, BlackOnWhite, RedOnWhite } from "./marks";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/studio", label: "Log In" },
] as const;

/** Swapping one of these classes on <html> is the whole theme switch:
 *  globals.css redefines the colour tokens under each, and every component
 *  follows. The default palette is the bare :root, hence the null class. */
const THEMES = [
  { id: "green", className: "black-on-green", swatch: BlackOnGreen },
  { id: "red", className: null, swatch: RedOnWhite },
  { id: "bw", className: "black-and-white", swatch: BlackOnWhite },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

const DEFAULT_THEME: ThemeId = "red";

/** Home only matches exactly; the rest keep their mark on child routes too,
 *  so /projects/[slug] still reads as Projects. */
function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** The square is the checkbox: filled when on, an empty outline when off. A
 *  `swatch` replaces it for the theme rows, dimmed while that theme is off. */
function CheckRow({
  checked,
  onToggle,
  label,
  swatch,
}: {
  checked: boolean;
  onToggle: () => void;
  /** Optional: the swatch rows stand on their own. */
  label?: string;
  swatch?: ReactNode;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      aria-label={label}
      className="flex cursor-pointer items-center gap-2 text-xs font-diatype text-primary"
    >
      <span
        className={cn(
          "aspect-square h-6 w-6 border border-primary",
          swatch
            ? !checked && "opacity-40"
            : checked
              ? "bg-primary"
              : "bg-transparent",
        )}
      >
        {swatch}
      </span>
      {label}
    </button>
  );
}

export default function MultiVertNav() {
  // Both toggles drive the one shared reel — the same state BottomNav and the
  // consent box read.
  const { playing, toggle } = useReel();
  const { muted, toggleMute } = useSound();
  const pathname = usePathname();
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);

  // The class outlives a remount (it is on <html>, not in React state), so the
  // rows read it back rather than assuming the default.
  useEffect(() => {
    const found = THEMES.find(
      (t) =>
        t.className && document.documentElement.classList.contains(t.className),
    );
    setTheme(found?.id ?? DEFAULT_THEME);
  }, []);

  function selectTheme(next: ThemeId) {
    // Every class is set explicitly rather than just adding the new one — the
    // palettes are exclusive, and a leftover class would win on cascade order.
    for (const t of THEMES) {
      if (t.className) {
        document.documentElement.classList.toggle(t.className, t.id === next);
      }
    }
    setTheme(next);
  }

  return (
    <div className="fixed top-14 left-0 z-40 hidden h-dvh w-[25vw] flex-col gap-3 pt-1.5 px-3 lg:flex ">
      <div className="flex flex-col items-start justify-start gap-3 text-primary">
        <span className="flex items-center border-b border-primary font-visual text-sm">
          Menu
        </span>
        <div className="w-full flex flex-col items-start justify-start">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="px-0 uppercase border-b font-thin border-primary  gap-1.5 w-full  tracking-wide font-visual "
              asChild
            >
              <Link href={item.href}>
                {/* The slot is always there, filled only on the current route:
                  a marker that appears and disappears would shift every
                  label sideways. */}
                <span
                  className={cn(
                    "h-6 w-6 ",
                    isActive(pathname, item.href) && "bg-primary",
                  )}
                />
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-3  items-start justify-start">
          <CheckRow checked={!muted} onToggle={toggleMute} label="Sound On" />

          <CheckRow checked={playing} onToggle={toggle} label="Play ShowReel" />
        </div>
        <div className="flex h-9 border-b border-primary gap-3">
          {THEMES.map(({ id, swatch: Swatch }) => (
            <CheckRow
              key={id}
              checked={theme === id}
              onToggle={() => selectTheme(id)}
              swatch={<Swatch className="block h-full w-full" />}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
