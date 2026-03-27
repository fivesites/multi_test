import Link from "next/link";
import HomeHero from "./components/HomeHero";
import AboutSection from "./components/AboutSection";
import WorkSection from "./components/WorkSection";

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
  media?: {
    _type: string;
    asset?: unknown;
    aspectRatio?: number;
    aspectRatioType?: string;
  }[];
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
          url: urlFor(item as Parameters<typeof urlFor>[0])
            .width(1920)
            .url(),
        });
      } else if (item.aspectRatioType === "cube") {
        cubeImages.push({
          label,
          slug: w.slug,
          url: urlFor(item as Parameters<typeof urlFor>[0])
            .width(1200)
            .url(),
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
          url: urlFor(w.coverImage).width(1920).url(),
        });
      });
  }
  // Fallback: if no cubes, fall back to portrait images on mobile
  const mobileImages = cubeImages.length > 0 ? cubeImages : portraitImages;

  return (
    <main className="relative h-screen overflow-y-scroll snap-y snap-mandatory">
      <Nav />
      <MobileMultiTextHeader />

      {/* Hero */}
      <HomeHero portraitImages={portraitImages} mobileImages={mobileImages} />

      <AboutSection />

      <WorkSection />

      {/* Contact */}
      <section id="contact" className="relative flex flex-col snap-start">
        <Link
          href="/contact"
          className="h-screen flex items-center justify-center bg-secondary group"
        >
          <span className="font-rounded text-4xl lg:text-6xl text-secondary-foreground transition-opacity duration-300 group-hover:opacity-60">
            Connect with us
          </span>
        </Link>
      </section>

      <div className="snap-start">
        <HomeFooter />
      </div>
    </main>
  );
}
