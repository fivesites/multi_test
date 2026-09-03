"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePixelCorners } from "@/app/hooks/usePixelCorners";

export default function Footer() {
  // Only the top edge meets the page — the bottom sits at the viewport edge —
  // so just the top two corners get notched.
  const pixelRef = usePixelCorners<HTMLDivElement>();

  return (
    <div
      ref={pixelRef}
      className="pixelCornersTop bg-secondary  w-full pt-6 gap-0 flex flex-col justify-between  items-start h-dvh text-secondary-foreground px-6 lg:px-0"
    >
      <div className="grid grid-cols-4 lg:grid-cols-12 items-baseline justify-start h-min">
        <h4 className="col-start-2 lg:col-start-4  h4BtnText ">GET IN TOUCH</h4>
        <Button
          size="sm"
          className="px-0 text-secondary-foreground "
          variant="link"
          asChild
        >
          <Link href="connect@multi2.co">info@multi2.co</Link>
        </Button>

        <h4 className="col-start-2 lg:col-start-8 h4BtnText whitespace-nowrap  ">
          multisquared members
        </h4>
        <div className="flex-col col-start-4 lg:col-start-10 justify-end lg:justify-start">
          <Button
            size="sm"
            variant="link"
            className="px-0 text-secondary-foreground "
            asChild
          >
            <Link href="connect@multi2.co">Adam Odelfelt</Link>
          </Button>
          <Button
            size="sm"
            variant="link"
            className="px-0 text-secondary-foreground "
            asChild
          >
            <Link href="connect@multi2.co">Daniel von Malmborg</Link>
          </Button>
        </div>

        <h4 className="col-start-2 lg:col-start-4 h4BtnText  ">DESIGN & DEV</h4>
        <Button
          size="sm"
          variant="link"
          className="px-0 text-secondary-foreground "
          asChild
        >
          <Link href="connect@multi2.co">Joel Järvi</Link>
        </Button>
      </div>
      <div className="flex flex-row-reverse lg:flex-row col-start-1 col-span-12  justify-between w-full items-baseline lg:p-6 ">
        <h1 className="ml-0 lg:-ml-5 h1Text text-secondary-foreground mb-0  ">
          multi2.co
        </h1>
        <h4 className="h4BtnText text-secondary-foreground ">
          Copyright © 2026
        </h4>
      </div>
    </div>
  );
}
