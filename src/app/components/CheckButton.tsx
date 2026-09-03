"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import TerminalM2Button from "./TerminalM2Button";

type Props = {
  className?: string;
  label?: string;
  onClick?: () => void;
  href?: string;
  /** Fills the square: the checkbox is on, or the route/theme is current. */
  active?: boolean;
  /** Type the label out instead of just setting it. */
  terminal?: boolean;
  /** Replaces the label entirely — a swatch, a mark, a nested control. */
  children?: ReactNode;
  toggleOpen?: () => void;
  checkSize?: string;
  hoverFill?: boolean;
  tabIndex?: number;
  size?: "sm" | "md" | "lg" | "label";
  /** Which side of the box the label sits on. Omitted (or "right") keeps the
   *  default — box first, label after it. "left" puts the label first and
   *  pushes the box out to the far end of the row. */
  labelSide?: "left" | "right";
};

/** `size` is geometry only — box, gutter and gap. Whether a
 *  square shows at all is decided by `href`, not by the size. Height carries
 *  no vertical padding: the row is centred by items-center, and padding on one
 *  side only would pull it back off centre.
 *
 *  `label` is `lg`'s type at no size of its own — `h-auto px-0` — for a
 *  heading that sits in a layout's own grid rather than in a control row. */
const SIZE_BOX = {
  sm: "h-auto items-center",
  md: "px-3 lg:px-6 h-12 items-center  lg:h-16",
  lg: "px-6 lg:px-3 h-16 lg:h-12 items-center justify-start",
  label: "h-3 px-0 justify-start items-center",
} as const;

/** Type scale. `sm` is a compact control — a filter chip, a dense row — so it
 *  drops to the small UI size rather than the display size the larger ones use. */
const SIZE_TEXT = {
  sm: "text-sm leading-[1]",
  md: "text-3xl lg:text-3xl",
  lg: "text-base lg:text-lg lowercase",
  label: "text-base lg:text-lg lowercase",
} as const;

const SIZE_GAP = {
  sm: "gap-x-2",
  md: "gap-x-3 lg:gap-x-4",
  lg: "gap-x-3 lg:gap-x-3",
  label: "gap-x-3 lg:gap-x-3",
} as const;

/** The mark is a glyph now (■ / □ — U+25A0 / U+25A1), so its footprint is a
 *  font size rather than a box. Sized in `em` so it tracks the label: the
 *  glyph body renders at roughly 0.7em, so ~2.2em keeps it at least twice the
 *  label's height. It renders in `font-visual` and shares the label baseline. */
const SIZE_CHECK = {
  sm: "text-[2.2em]",
  md: "text-[2.2em]",
  lg: "text-[1em]",
  label: "text-[1em]",
} as const;

/** The checkbox marks, straight from the font: `filledbox` (U+25A0, &#9632;)
 *  when active, `uni25A1` (U+25A1, &#9633;) when not. */
const MARK_ACTIVE = "■";
const MARK_INACTIVE = "□";

/** The square is the checkbox: primary when active, muted when not. The whole
 *  control is one hover target — `group` on the outer element means the square
 *  and the label light up together whichever one the pointer is over.
 *  Renders as a link with `href`, a button with `onClick`, and a plain span
 *  when it is only a marker. Links carry the square too — on a nav row it is
 *  what marks the current route. */
export default function CheckButton({
  tabIndex,
  className,
  checkSize = "",
  label,
  onClick,
  size = "md",
  href,
  active = false,
  terminal = false,
  children,
  hoverFill = false,
  labelSide,

  toggleOpen,
}: Props) {
  const content = (
    <div
      className={cn(
        "flex font-visual font-normal   ",
        SIZE_TEXT[size],
        hoverFill ? "hover:bg-primary hover:text-primary" : "",
        className,
        SIZE_BOX[size],
      )}
    >
      <div
        className={cn(
          // The square holds no text, so flexbox synthesises its baseline from
          // its bottom edge — it sits on the label's baseline the way a letter
          // does. This group is shrink-to-fit, so the outer items-center is
          // what centres the pair as a unit inside the button.
          "flex items-baseline",
          // "left" flips the pair so the label reads first and the box trails
          // it, spread to the row's two ends — the settings-row pattern. Takes
          // the full width to spread across.
          labelSide === "left"
            ? "flex-row-reverse justify-start w-full"
            : "justify-start",
          SIZE_GAP[size],
        )}
      >
        <span
          aria-hidden
          className={cn(
            "shrink-0 select-none font-visual font-normal leading-none text-primary",
            SIZE_CHECK[size],
          )}
        >
          {/* Hovering anywhere in the control flips the fill: the empty box
              fills in, the filled box empties out. Both glyphs are the same
              width, so the swap doesn't shift the row. */}
          <span className="group-hover:hidden">
            {active ? MARK_ACTIVE : MARK_INACTIVE}
          </span>
          <span className="hidden group-hover:inline">
            {active ? MARK_INACTIVE : MARK_ACTIVE}
          </span>
        </span>
        {children ??
          (terminal ? (
            <TerminalM2Button
              className={className}
              text={label ?? ""}
              visible
              delay={0}
            />
          ) : (
            label
          ))}
      </div>
    </div>
  );

  const cls = cn(
    "group transition-colors",
    active ? "text-primary" : "text-primary hover:text-primary/90",
    (href || onClick) && "cursor-pointer",
    className,
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cls}>
        {content}
      </Link>
    );
  }

  if (!onClick) return <span className={cls}>{content}</span>;

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={active}
      aria-label={label}
      onClick={onClick}
      className={cls}
    >
      {content}
    </button>
  );
}
