import Link from "next/link";
import HomeHero from "./components/HomeHero";
import AboutSection from "./components/AboutSection";
import WorkSection from "./components/WorkSection";
import CheckerboardBg from "./components/CheckerboardBg";
import { SavedHorizontalBorder } from "./components/SavedBorder";
import { client } from "../../sanity/lib/client";
import { workCardsQuery } from "../../sanity/lib/queries";
import { urlFor } from "../../sanity/lib/image";
import Nav from "./components/Nav";
import MobileMultiTextHeader from "./components/MobileMultiTextHeader";
import HomeFooter from "./components/HomeFooter";

type HeroImage = { label: string; slug: string; url: string };

type WorkCardData = {
  _id: string;
  title: string;
  client?: string;
  slug: string;
  coverImage?: { asset: { _ref: string }; aspectRatio?: number };
  media?: { _type: string; asset?: unknown; aspectRatio?: number }[];
};

export default async function Page() {
  const works: WorkCardData[] = await client.fetch(workCardsQuery);

  const portraitImages: HeroImage[] = [];
  const landscapeImages: HeroImage[] = [];

  for (const w of works) {
    const label = w.client || w.title;
    for (const item of w.media ?? []) {
      if (item._type !== "image" || !item.asset) continue;
      const ar = item.aspectRatio ?? 1;
      if (ar < 0.75) {
        portraitImages.push({ label, slug: w.slug, url: urlFor(item as Parameters<typeof urlFor>[0]).width(800).url() });
      } else if (ar > 1.3) {
        landscapeImages.push({ label, slug: w.slug, url: urlFor(item as Parameters<typeof urlFor>[0]).width(1200).url() });
      }
    }
  }

  // Fallback: if one pool is empty, use cover images
  if (portraitImages.length === 0) {
    works.filter((w) => w.coverImage?.asset).forEach((w) => {
      portraitImages.push({ label: w.client || w.title, slug: w.slug, url: urlFor(w.coverImage).width(800).url() });
    });
  }
  if (landscapeImages.length === 0) {
    works.filter((w) => w.coverImage?.asset).forEach((w) => {
      landscapeImages.push({ label: w.client || w.title, slug: w.slug, url: urlFor(w.coverImage).width(1200).url() });
    });
  }

  return (
    <main className="relative h-screen overflow-y-scroll lg:snap-y lg:snap-mandatory">
      <Nav />
      <CheckerboardBg />

      <MobileMultiTextHeader />

      {/* Hero */}
      <HomeHero portraitImages={portraitImages} landscapeImages={landscapeImages} />

      {/* About — 288px (9 × 32px grid units) */}
      <AboutSection />

      {/* xs border (32px) to fill to next 320px grid line */}
      <SavedHorizontalBorder size="xs" />

      <WorkSection />

      <SavedHorizontalBorder size="m" />

      {/* Contact */}
      <section id="contact" className="relative flex flex-col lg:snap-start">
        <Link
          href="/connect"
          className="h-screen flex items-center justify-center bg-secondary"
        >
          <span className="font-rounded font-black text-6xl lg:text-8xl text-secondary-foreground">
            Connect
          </span>
        </Link>
      </section>

      <HomeFooter />
    </main>
  );
}
