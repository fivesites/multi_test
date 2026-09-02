"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePixelCorners } from "@/app/hooks/usePixelCorners";

export default function HomeFooter() {
  // Only the top edge meets the page — the bottom sits at the viewport edge —
  // so just the top two corners get notched.
  const pixelRef = usePixelCorners<HTMLDivElement>();

  return (
    <div
      ref={pixelRef}
      className="pixelCornersTop bg-secondary  w-full pt-6 gap-0 grid grid-cols-4 lg:grid-cols-12 items-start justify-start h-dvh text-secondary-foreground px-6 lg:px-0"
    >
      <h3 className="col-start-2 lg:col-start-4  font-visual text-sm font-normal tracking-wide  whitespace-nowrap ">
        GET IN TOUCH
      </h3>
      <Button
        size="xs"
        className="px-0 text-secondary-foreground "
        variant="link"
        asChild
      >
        <Link href="connect@multi2.co">info@multi2.co</Link>
      </Button>

      <h3 className="col-start-2 lg:col-start-8 font-visual text-sm font-normal tracking-wide uppercase whitespace-nowrap  ">
        multisquared members
      </h3>
      <div className="flex-col col-start-4 lg:col-start-10 justify-end lg:justify-start">
        <Button
          size="xs"
          variant="link"
          className="px-0 text-secondary-foreground "
          asChild
        >
          <Link href="connect@multi2.co">Adam Odelfelt</Link>
        </Button>
        <Button
          size="xs"
          variant="link"
          className="px-0 text-secondary-foreground "
          asChild
        >
          <Link href="connect@multi2.co">Daniel von Malmborg</Link>
        </Button>
      </div>

      <h3 className="col-start-2 lg:col-start-4 font-visual text-sm font-normal tracking-wide  ">
        DESIGN & DEV
      </h3>
      <Button
        size="xs"
        variant="link"
        className="px-0 text-secondary-foreground "
        asChild
      >
        <Link href="connect@multi2.co">Joel Järvi</Link>
      </Button>

      <div className="flex flex-row-reverse lg:flex-row col-start-1 col-span-12  justify-between w-full items-baseline lg:p-6 ">
        <h3 className="ml-0 lg:-ml-5 font-visual tracking-normal text-4xl leading-tight lg:text-[16rem] font-light lg:leading-[0.77] text-secondary-foreground mb-0  ">
          multi2.co
        </h3>
        <h3 className="font-visual text-sm tracking-wide text-secondary-foreground ">
          Copyright © 2026
        </h3>
      </div>
    </div>
  );
}
