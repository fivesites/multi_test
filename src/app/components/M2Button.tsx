"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import TypedWord from "./TypedWord";

type M2ButtonProps = {
  className?: string;
  text: string;
  visible: boolean;
  delay: number;
  onClick?: () => void;
  href?: string;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  lg?: boolean;
  noClick?: boolean;
  active?: boolean;
};

const MS = 22;

export default function M2Button({
  className = "text-left",
  text,
  visible,
  delay,
  onClick,
  href,
  loading = false,
  loadingText = "Loading multi2.co",
  disabled = false,
  lg = false,
  noClick = false,
  active = false,
}: M2ButtonProps) {
  const isInteractive = !!href || !!onClick;
  const m2ButtonStyles = cn(
    lg ? "buttonTextLG" : "buttonTextSM",
    "font-visual",
    noClick ? "text-lader" : "text-lava",
    isInteractive && "cursor-pointer",
    active && "text-liguriskt",
  );
  const [dots, setDots] = useState(".");
  const [showDots, setShowDots] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShowDots(false);
      setDots(".");
      return;
    }
    const showT = setTimeout(() => setShowDots(true), loadingText.length * MS);
    const dotsT = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 400);
    return () => {
      clearTimeout(showT);
      clearInterval(dotsT);
    };
  }, [loading, loadingText]);

  const inner = loading ? (
    <span className="inline-flex items-baseline text-left">
      <TypedWord text={loadingText} visible={loading} delay={0} />
      {showDots && <span>{` (${dots})`}</span>}
    </span>
  ) : (
    <TypedWord text={text} visible={visible} delay={delay} />
  );

  const content = inner;

  if (!href && !onClick) {
    return <span className={cn(m2ButtonStyles, className)}>{content}</span>;
  }

  if (href) {
    return (
      <Link href={href} className={cn(m2ButtonStyles, className)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(m2ButtonStyles, className)}
    >
      {content}
    </button>
  );
}
