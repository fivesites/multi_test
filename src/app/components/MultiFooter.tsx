"use client";

import TypedWord from "./TypedWord";

export default function MultiFooter() {
  return (
    <footer className="w-full pt-2 hidden lg:grid grid-cols-1 items-start lg:grid-cols-6 h-[66.6dvh] ">
      <TypedWord
        text="Copyright Multi² 2026. All Rights Reserved."
        visible
        delay={0}
        className="col-span-2 font-visual text-lg font-normal tracking-wide leading-tight text-lava items-center text-left"
      />
    </footer>
  );
}
