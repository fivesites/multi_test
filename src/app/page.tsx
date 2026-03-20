import Link from "next/link";
import HomeHero from "./components/HomeHero";
import AboutSection from "./components/AboutSection";
import WorkSection from "./components/WorkSection";
import CheckerboardBg from "./components/CheckerboardBg";
import HorizontalBorder from "./components/HorizontalBorder";
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
  media?: { _type: string; asset?: unknown; aspectRatio?: number; aspectRatioType?: string }[];
};

export default async function Page() {
  const works: WorkCardData[] = await client.fetch(workCardsQuery);

  const portraitImages: HeroImage[] = [];
  const cubeImages: HeroImage[] = [];

  for (const w of works) {
    const label = w.client || w.title;
    for (const item of w.media ?? []) {
      if (item._type !== "image" || !item.asset) continue;
      if (item.aspectRatioType === "portrait") {
        portraitImages.push({
          label,
          slug: w.slug,
          url: urlFor(item as Parameters<typeof urlFor>[0]).width(800).url(),
        });
      } else if (item.aspectRatioType === "cube") {
        cubeImages.push({
          label,
          slug: w.slug,
          url: urlFor(item as Parameters<typeof urlFor>[0]).width(800).url(),
        });
      }
    }
  }

  // Fallback: if portrait pool is empty, use cover images
  if (portraitImages.length === 0) {
    works
      .filter((w) => w.coverImage?.asset)
      .forEach((w) => {
        portraitImages.push({
          label: w.client || w.title,
          slug: w.slug,
          url: urlFor(w.coverImage).width(800).url(),
        });
      });
  }
  // Fallback: if no cubes, fall back to portrait images on mobile
  const mobileImages = cubeImages.length > 0 ? cubeImages : portraitImages;

  return (
    <main className="relative h-screen overflow-y-scroll lg:snap-y lg:snap-mandatory">
      <Nav />
      <CheckerboardBg />

      <MobileMultiTextHeader />

      {/* Hero */}
      <HomeHero
        portraitImages={portraitImages}
        mobileImages={mobileImages}
      />
      <HorizontalBorder size="s" />
      {/* About — 288px (9 × 32px grid units) */}
      <AboutSection />
      <HorizontalBorder size="xs" />
      {/* xs border (32px) to fill to next 320px grid line */}

      <WorkSection />

      <HorizontalBorder size="m" />

      {/* Contact */}
      <section id="contact" className="relative flex flex-col snap-start">
        <Link
          href="/contact"
          className="h-screen flex items-center justify-center bg-secondary"
        >
          <span className="font-rounded font-black text-6xl lg:text-8xl text-secondary-foreground">
            Connect
          </span>
        </Link>
      </section>
      <HorizontalBorder size="m" />

      <div className="snap-start">
        <HomeFooter />
      </div>
    </main>
  );
}
