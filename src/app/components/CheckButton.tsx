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
  size?: "sm" | "md" | "lg";
};

/** `size` is geometry only — box, gutter and gap. Whether a
 *  square shows at all is decided by `href`, not by the size. Height carries
 *  no vertical padding: the row is centred by items-center, and padding on one
 *  side only would pull it back off centre. */
const SIZE_BOX = {
  sm: "h-auto items-center",
  md: "px-3 lg:px-6 h-12 items-center  lg:h-16",
  lg: "px-5 lg:px-4 h-14 lg:h-16 items-center",
} as const;

/** Type scale. `sm` is a compact control — a filter chip, a dense row — so it
 *  drops to the small UI size rather than the display size the larger ones use. */
const SIZE_TEXT = {
  sm: "text-sm leading-[1]",
  md: "text-[2rem] lg:text-[2.05rem]",
  lg: "text-[2rem] lg:text-[2.05rem]",
} as const;

const SIZE_GAP = {
  sm: "gap-x-2",
  md: "gap-x-3 lg:gap-x-4",
  lg: "gap-x-4",
} as const;

/** The mark's footprint. Its border is a hairline at every size, so that sits
 *  on the base class rather than being repeated per entry. */
const SIZE_CHECK = {
  sm: "w-3 h-3 lg:w-2 lg:h-2",
  md: "w-3 h-3 lg:w-4 lg:h-4",
  lg: "w-4 h-4",
} as const;

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

  toggleOpen,
}: Props) {
  const content = (
    <div
      className={cn(
        "flex font-visual font-thin ",
        SIZE_TEXT[size],
        hoverFill ? "hover:bg-primary hover:text-secondary" : "",
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
          SIZE_GAP[size],
        )}
      >
        <span
          className={cn(
            "aspect-square shrink-0 border-[2px] border-primary transition-colors",
            SIZE_CHECK[size],
            // Hovering anywhere in the control previews the active fill.
            active
              ? "bg-primary group-hover:bg-secondary"
              : "bg-transparent group-hover:bg-secondary",
          )}
        />
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
