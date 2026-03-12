import Link from "next/link";
import HomeHero from "./components/HomeHero";
import AboutSection from "./components/AboutSection";
import WorkSection from "./components/WorkSection";

export default function Page() {
  return (
    <main className="relative">
      {/* Hero — checkerboard + cycling text */}
      <HomeHero />

      {/* About — sticky scroll text reveal */}
      <AboutSection />

      {/* Work — fetched from Sanity */}
      <WorkSection />

      {/* Contact */}
      <section
        id="contact"
        className="relative h-screen flex items-center justify-center overflow-hidden bg-foreground snap-start"
      >
        <Link href="/contact" className="relative z-10">
          <span className="text-background">connect</span>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-black h-screen snap-start" />
    </main>
  );
}
