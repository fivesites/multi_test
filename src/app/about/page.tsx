"use client";

import AboutSectionText from "@/app/components/AboutSectionText";
import { useCopyEntry, useCopyBody } from "@/context/CopyContext";
import LandningBlock from "@/app/components/LandningBlock";

export default function AboutPage() {
  const aboutEntry = useCopyEntry("about-intro");
  const aboutBody = useCopyBody("about-intro");

  return (
    <div
      id="about"
      className="relative   w-full px-3 lg:px-6 pt-28 lg:mt-0 lg:pt-36   "
    >
      <LandningBlock
        label="about"
        className="h-[25dvh]   items-center  w-full bg-transparent"
        // Lines the "projects" label up with the topbar's "sound off": column 3
        // of the block's eight-column grid is the same 25% as column 4 of the
        // bar's twelve, both measured inside the shared px-6 gutter.
        labelClassName="col-start-2 col-span-3 lg:col-start-3 lg:col-span-4"
      ></LandningBlock>
    </div>
  );
}
