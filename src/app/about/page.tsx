"use client";

import AboutSectionText from "@/app/components/AboutSectionText";
import { useCopyEntry, useCopyBody } from "@/context/CopyContext";

export default function AboutPage() {
  const aboutEntry = useCopyEntry("about-intro");
  const aboutBody = useCopyBody("about-intro");

  return (
    <div className="min-h-screen" style={{ paddingTop: "var(--nav-height)" }}>
      <AboutSectionText
        plainText={aboutEntry?.plainText ?? ""}
        text={aboutBody ?? undefined}
      />
    </div>
  );
}
