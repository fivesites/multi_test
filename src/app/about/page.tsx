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
        className="h-[25dvh]   content-center  w-full bg-transparent"
        labelClassName="col-start-1 col-span-3 lg:col-start-1 lg:col-span-3"
      ></LandningBlock>
    </div>
  );
}
