import Link from "next/link";
import HomeHero from "./components/HomeHero";
import ClientSquared from "./components/ClientSquared";
import AboutSection from "./components/AboutSection";
import WorkSection from "./components/WorkSection";
import CheckerboardBg from "./components/CheckerboardBg";
import { SavedHorizontalBorder } from "./components/SavedBorder";
import { client } from "../../sanity/lib/client";
import { workCardsQuery } from "../../sanity/lib/queries";
import { urlFor } from "../../sanity/lib/image";
import Nav from "./components/Nav";

type WorkCardData = {
  _id: string;
  title: string;
  client?: string;
  slug: string;
  coverImage?: { asset: { _ref: string } };
};

export default async function Page() {
  const works: WorkCardData[] = await client.fetch(workCardsQuery);
  const heroWorks = works
    .filter((w) => w.coverImage?.asset)
    .map((w) => ({
      label: w.client || w.title,
      slug: w.slug,
      coverImageUrl: urlFor(w.coverImage).width(800).url(),
    }));

  return (
    <main className="relative h-screen overflow-y-scroll snap-y snap-mandatory">
      <Nav />
      <CheckerboardBg />

      {/* Hero — h-screen, borders managed inside HomeHero */}
      <HomeHero works={heroWorks} />

      {/* About — 288px (9 × 32px grid units) */}
      <AboutSection />

      {/* xs border (32px) to fill to next 320px grid line */}
      <SavedHorizontalBorder size="xs" />

      <WorkSection />

      <SavedHorizontalBorder size="m" />

      {/* Contact */}
      <section id="contact" className="relative flex flex-col snap-start">
        <Link
          href="/connect"
          className="h-screen flex items-center justify-center bg-secondary"
        >
          <span className="font-rounded font-black text-6xl lg:text-8xl text-secondary-foreground">
            Connect
          </span>
        </Link>
      </section>

      <SavedHorizontalBorder size="l" />

      <footer className="flex items-center justify-center py-8 h-[50vh]">
        <ClientSquared
          texts={
            heroWorks.map((w) => w.label).filter(Boolean).length > 0
              ? heroWorks.map((w) => w.label)
              : ["Multi", "Jureskog", "Ikea", "ATG"]
          }
          className="text-foreground text-6xl tracking-normal font-rounded font-black lg:text-8xl"
        />
      </footer>
    </main>
  );
}
