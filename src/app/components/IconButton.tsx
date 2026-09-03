"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  label?: string;
  onClick?: () => void;
  href?: string;
  /** Fills the square, same as CheckButton. Ignored when `icon` is set. */
  active?: boolean;
  tabIndex?: number;
  size?: "sm" | "md" | "lg" | "label";
  /** When set, the checkbox is dropped and this sits flush on the right of the
   *  label — an arrow glyph (↗ ↑ →) rather than a toggle. */
  icon?: ReactNode;
};

/** Geometry, in step with CheckButton so the two read as the same family. */
const SIZE_BOX = {
  sm: "h-auto items-center",
  md: "px-3 lg:px-6 h-12 items-center  lg:h-16",
  lg: "px-6 lg:px-3 h-16 lg:h-12 items-center justify-start",
  label: "h-3 px-0 justify-start items-center",
} as const;

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

const SIZE_CHECK = {
  sm: "text-[2.2em]",
  md: "text-[2.2em]",
  lg: "text-[1em]",
  label: "text-[1em]",
} as const;

const MARK_ACTIVE = "■";
const MARK_INACTIVE = "□";

/**
 * A CheckButton with an alternate face: pass `icon` and the checkbox is
 * dropped, the label leads, and the icon trails on the right — a link
 * affordance rather than a toggle. Without `icon` it falls back to the
 * CheckButton mark. Renders a link with `href`, a button with `onClick`,
 * a plain span otherwise.
 */
export default function IconButton({
  className,
  label,
  onClick,
  href,
  active = false,
  tabIndex,
  size = "md",
  icon,
}: Props) {
  const content = (
    <div
      className={cn(
        "flex font-visual font-normal   ",
        SIZE_TEXT[size],
        className,
        SIZE_BOX[size],
      )}
    >
      <div
        className={cn(
          "flex items-baseline justify-start",
          icon ? "gap-x-0" : SIZE_GAP[size],
        )}
      >
        {icon ? (
          <>
            <span>{label}</span>
            <span aria-hidden className="shrink-0">
              {icon}
            </span>
          </>
        ) : (
          <>
            <span
              aria-hidden
              className={cn(
                "shrink-0 select-none font-visual font-normal leading-none text-primary",
                SIZE_CHECK[size],
              )}
            >
              <span className="group-hover:hidden">
                {active ? MARK_ACTIVE : MARK_INACTIVE}
              </span>
              <span className="hidden group-hover:inline">
                {active ? MARK_INACTIVE : MARK_ACTIVE}
              </span>
            </span>
            <span>{label}</span>
          </>
        )}
      </div>
    </div>
  );

  const cls = cn(
    "group transition-colors text-primary hover:text-primary/90",
    (href || onClick) && "cursor-pointer",
    className,
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cls} tabIndex={tabIndex}>
        {content}
      </Link>
    );
  }

  if (!onClick) return <span className={cls}>{content}</span>;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cls}
      tabIndex={tabIndex}
    >
      {content}
    </button>
  );
}
