"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReel } from "@/context/ReelContext";
import { NAV_BUTTON, navButtonColors } from "./M2NavButton";
import TerminalM2Button from "./TerminalM2Button";

/**
 * The first cell of the desktop nav: the terminal logo. Desktop only — the
 * mobile bar renders a plain MULTI² button instead.
 */
export default function M2LogoButton({
  text = "MULTI²",
  visible,
  loading = false,
  loadingText,
  phrases,
  trigger,
  stopTrigger,
  onClick,
  className = "",
}: {
  text?: string;
  visible: boolean;
  loading?: boolean;
  loadingText?: string;
  phrases: string[];
  trigger: string;
  stopTrigger: number;
  onClick?: () => void;
  className?: string;
}) {
  const { overReel } = useReel();

  return (
    <motion.button
      layout
      transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={
        onClick ?? (() => window.scrollTo({ top: 0, behavior: "smooth" }))
      }
      className={cn(
        // same cell shape and colours as the nav links; only the column and
        // desktop-only visibility differ
        NAV_BUTTON,
        navButtonColors(overReel),
        // group: lets the label react to hovering the whole cell, not just
        // the text itself
        "group hidden lg:flex lg:col-start-1",
        className,
      )}
    >
      {/* no onClick here: TerminalM2Button would render its own <button>.
          It paints its own colour, so the text colour has to come through
          className — the wrapper's can't reach it. */}
      <TerminalM2Button
        text={text}
        visible={visible}
        delay={0}
        loading={loading}
        loadingText={loadingText}
        className={cn(
          "text-[17px] leading-[12px] transition-colors",
          overReel
            ? "text-background"
            : "text-neutral-600 group-hover:text-neutral-500",
        )}
        phrases={phrases}
        trigger={trigger}
        stopTrigger={stopTrigger}
      />
    </motion.button>
  );
}
