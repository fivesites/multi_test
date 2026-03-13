import Link from "next/link";
import HomeHero from "./components/HomeHero";
import AboutSection from "./components/AboutSection";
import PhilosophyTeaser from "./components/PhilosophyTeaser";
import WorkSection from "./components/WorkSection";

export default function Page() {
  return (
    <main className="relative">
      {/* Hero — checkerboard with cycling text + 2 glyph */}
      <HomeHero />

      {/* About — starts typing on enter */}
      <AboutSection />

      {/* Work — fetched from Sanity */}
      <WorkSection />

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

      <PhilosophyTeaser />
    </main>
  );
}
