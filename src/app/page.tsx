import Link from "next/link";
import HomeHero from "./components/HomeHero";
import { Scroll } from "lucide-react";
import ScrollGradientGrid from "./components/ScrollGradientGrid";

export default function Page() {
  return (
    <main className="relative">
      {/* Hero + About + Projects (sticky scroll) */}
      <HomeHero />

      {/* Contact — 100vh */}
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
