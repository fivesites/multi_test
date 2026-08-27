"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useReel } from "@/context/ReelContext";
import M2Button from "./M2Button";

/** Shared shape of every cell in the desktop nav grid — no colours. */
export const NAV_BUTTON =
  "lg:h-[60px] lg:col-span-1 lg:row-start-1 lg:row-span-2 py-1 px-2 lg:py-3 lg:px-3 flex items-start justify-start text-left buttonTextSM text-[17px] leading-[12px] cursor-pointer transition-colors";

/**
 * Colour treatment for a nav cell. Over the reel the nav blends with the
 * video; past it the cells are solid.
 */
export function navButtonColors(overReel: boolean, active = false) {
  if (overReel) return "bg-transparent mix-blend-difference text-background";
  return active
    ? "bg-neutral-300 mix-blend-normal text-foreground"
    : "bg-neutral-200 mix-blend-normal text-foreground hover:bg-neutral-300";
}

type M2NavButtonProps = {
  /** Typed label. Ignored when `children` is given. */
  label?: string;
  /** Renders a Link; without it, a button. */
  href?: string;
  onClick?: () => void;
  active?: boolean;
  visible?: boolean;
  delay?: number;
  /**
   * Column placement, e.g. "lg:col-start-2". Must be a literal class —
   * Tailwind scans source text, so it can't be built from a variable.
   */
  col?: string;
  className?: string;
  /** Custom content instead of the typed label (e.g. the terminal logo). */
  children?: ReactNode;
};

export default function M2NavButton({
  label,
  href,
  onClick,
  active = false,
  visible = true,
  delay = 0,
  col = "",
  className = "",
  children,
}: M2NavButtonProps) {
  const { overReel } = useReel();
  const classes = cn(
    NAV_BUTTON,
    col,
    navButtonColors(overReel, active),
    className,
  );

  // M2Button renders plain text when given neither href nor onClick, which is
  // what keeps this from nesting an <a> or <button> inside the wrapper.
  const content = children ?? (
    <M2Button text={label ?? ""} visible={visible} delay={delay} lg />
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
