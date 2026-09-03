"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePixelCorners } from "@/app/hooks/usePixelCorners";

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/connect", label: "Connect" },
] as const;

export default function Footer() {
  // Only the top edge meets the page — the bottom sits at the viewport edge —
  // so just the top two corners get notched.
  const pixelRef = usePixelCorners<HTMLDivElement>();

  return (
    <div
      className="
      "
    >
      <div
        ref={pixelRef}
        className="pixelCornersTop bg-secondary w-full flex flex-col justify-between items-stretch h-dvh text-secondary-foreground pt-6 "
      >
        {/* Contact columns. Each heading + its links is one grid cell, placed on
          an explicit column so the groups all sit on the top row and line up
          regardless of how many links they hold. Mobile stacks them in
          column two. */}
        <div className="grid grid-cols-3 lg:grid-cols-12 gap-y-8 items-baseline ">
          <nav className="col-start-2 col-span-3 lg:col-start-1 lg:col-span-2 flex flex-col items-start lg:px-6 mb-12 lg:mb-0  ">
            {NAV_LINKS.map((link) => (
              <Button
                key={link.href}
                size="sm"
                variant="link"
                className="px-0 text-secondary-foreground border-transparent"
                asChild
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </nav>

          <div className="flex flex-col">
            <Button
              variant="link"
              className="px-0 text-secondary-foreground border-transparent h3Text"
            >
              <Link href="/">Instagram</Link>
            </Button>
          </div>
        </div>

        {/* Sits flush against the bottom edge of the footer. leading-none trims
          the wordmark's line box so the glyphs, not the line box, meet the
          edge; items-end drops the copyright onto the same baseline. */}
        <div className="flex flex-row-reverse lg:flex-row justify-between w-full items-end px-3 lg:px-6 pb-4 lg:pb-6">
          <h1 className="ml-0 lg:-ml-5 h1Text leading-none text-secondary-foreground mb-0">
            multi2.co
          </h1>
          <h4 className="text-sm font-visual tracking-wide lowercase text-secondary-foreground">
            Copyright © 2026
          </h4>
        </div>
      </div>
    </div>
  );
}
