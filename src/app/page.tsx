import Link from "next/link";
import HomeHero from "./components/HomeHero";
import HeroText from "./components/HeroText";
import AboutSection from "./components/AboutSection";
import PhilosophyTeaser from "./components/PhilosophyTeaser";
import WorkSection from "./components/WorkSection";

export default function Page() {
  return (
    <main className="relative">
      {/* Hero — plain secondary background with cycling text */}
      <section className="snap-start h-screen bg-secondary flex items-center justify-center">
        <HeroText
          className="text-secondary-foreground text-6xl lg:text-8xl"
          texts={[
            "Multisquared",
            "multi2",
            "multisquared",
            "Multi2",
            "MULTISQUARED",
            "MULTI2",
          ]}
        />
      </section>

      {/* About — sticky scroll text reveal */}
      <AboutSection />

      {/* Philosophy teaser */}

      {/* Work — fetched from Sanity */}
      <WorkSection />

      {/* Contact */}
      <section id="contact" className="relative flex flex-col snap-start ">
        <Link
          href="/connect"
          className="h-screen flex items-center justify-center bg-secondary-foreground"
        >
          <span className="font-absolution1 text-6xl lg:text-8xl text-secondary">
            Let&apos;s link up
          </span>
        </Link>
      </section>
      <PhilosophyTeaser />

      {/* Checkerboard */}
      <HomeHero />
    </main>
  );
}
