"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomeFooter() {
  return (
    <div className=" bg-primary  w-full p-6 gap-0 grid grid-cols-4 h-[66.6dvh] text-primary-foreground">
      <div className="col-start-2 col-span-2 flex flex-col items-baseline h-full">
        <div className="flex justify-start gap-6 items-baseline ">
          <h3 className="font-diatype text-xs font-normal  ">GET IN TOUCH</h3>
          <Button
            size="xs"
            className="px-0 text-primary-foreground"
            variant="link"
            asChild
          >
            <Link href="connect@multi2.co">info@multi2.co</Link>
          </Button>
        </div>
        <span className="flex justify-start gap-6 items-baseline">
          <h3 className="font-diatype text-xs font-normal  ">DESIGN & DEV</h3>
          <Button
            size="xs"
            variant="link"
            className="px-0 text-primary-foreground "
            asChild
          >
            <Link href="connect@multi2.co">Joel Järvi</Link>
          </Button>
        </span>
      </div>
      <div className="flex flex-row-reverse lg:flex-row col-start-1 col-span-12  justify-between w-full items-end ">
        <h3 className="ml-0 lg:-ml-5 font-visual tracking-normal text-4xl leading-tight lg:text-[16rem] font-light lg:leading-[0.77] text-primary-foreground mb-0  ">
          multi2.co
        </h3>
        <h3 className="font-diatype text-xs font-normal text-primary-foreground uppercase">
          Copyright © 2026.
        </h3>
      </div>
    </div>
  );
}
