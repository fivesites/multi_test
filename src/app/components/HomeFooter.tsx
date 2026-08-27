"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomeFooter() {
  return (
    <div className=" bg-secondary w-full p-6 gap-0 flex flex-col justify-between h-[66.6dvh]">
      <div className="flex flex-col items-baseline h-full">
        <div className="flex justify-start gap-6 items-baseline ">
          <h3 className="font-diatype text-xs font-normal  text-secondary-foreground">
            GET IN TOUCH
          </h3>
          <Button
            size="xs"
            className="px-0 text-secondary-foreground"
            variant="link"
            asChild
          >
            <Link href="connect@multi2.co">info@multi2.co</Link>
          </Button>
        </div>
        <span className="flex justify-start gap-6 items-baseline">
          <h3 className="font-diatype text-xs font-normal  text-secondary-foreground">
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
        </span>
      </div>
      <div className="flex  justify-between w-full items-baseline ">
        <h3 className="ml-0 lg:-ml-5 font-visual tracking-normal text-4xl leading-tight lg:text-[16rem] font-light lg:leading-[0.77] text-secondary-foreground mb-0  ">
          multi2.co
        </h3>
        <h3 className="font-diatype text-xs font-normal text-secondary-foreground uppercase">
          Copyright © 2026.
        </h3>
      </div>
    </div>
  );
}
