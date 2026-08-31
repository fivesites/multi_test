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
  baseline?: boolean;
  hoverFill?: boolean;
  tabIndex?: number;
  size?: "sm" | "md";
};

/** The square is the checkbox: primary when active, muted when not. The whole
 *  control is one hover target — `group` on the outer element means the square
 *  and the label light up together whichever one the pointer is over.
 *  Renders as a link with `href`, a button with `onClick`, and a plain span
 *  when it is only a marker. */
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
  baseline = true,
  children,
  hoverFill = false,

  toggleOpen,
}: Props) {
  const content = (
    <div
      className={cn(
        "flex ",
        hoverFill ? "hover:bg-primary hover:text-secondary" : "",
        className,
        size === "md"
          ? "px-3 pb-0.5 lg:px-6 lg:pb-1 h-12 items-center  lg:h-16"
          : "h-9 px-2  pt-0 items-center",
      )}
    >
      <div
        className={`        flex 
    ${baseline ? "items-baseline" : "items-center"} ${size === "md" ? "gap-x-3 lg:gap-x-4" : "gap-x-3"}  
        `}
      >
        <span
          className={cn(
            "aspect-square shrink-0 border-2 border-primary transition-colors",
            size === "md"
              ? "border-2 w-3 h-3 lg:w-4 lg:h-4"
              : "border-1 w-3 h-3 lg:w-4 lg:h-4",
            // Hovering anywhere in the control previews the active fill.
            active
              ? "bg-primary group-hover:bg-secondary "
              : "bg-transparent border-primary group-hover:bg-secondary group-hover:border-primary",
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
