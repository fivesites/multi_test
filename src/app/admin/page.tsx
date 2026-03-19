"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import MultiGenerator from "@/app/components/MultiGenerator";
import MultiComposer from "@/app/components/MultiComposer";
import AssetLibrary from "@/app/components/AssetLibrary";
import ClientSquared from "@/app/components/ClientSquared";
import HeroHeader from "@/app/components/HeroHeader";
import { Button } from "@/components/ui/button";

type Tab = "studio" | "compose" | "library";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("studio");
  const mainRef  = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLElement>(null);

  const scrollToTools = () => {
    if (!mainRef.current || !toolsRef.current) return;
    mainRef.current.scrollTo({ top: toolsRef.current.offsetTop, behavior: "smooth" });
  };

  return (
    <div
      ref={mainRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory bg-background text-foreground"
    >
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="snap-start">
        <HeroHeader
          primary={
            <ClientSquared
              texts={["Dashboard", "Studio", "Compose", "Brand", "Assets"]}
              className="font-rounded font-black text-4xl lg:text-5xl text-primary-foreground"
            />
          }
          primaryMeta={
            <div className="p-6">
              <p className="font-rounded text-primary-foreground/50 text-xs uppercase tracking-widest">
                Multi² Dashboard
              </p>
            </div>
          }
          col2={
            /* Mobile: 3-button row stacked; Desktop: split CMS / Brand */
            <>
              {/* Mobile */}
              <div className="lg:hidden flex flex-col justify-center gap-3 p-6 h-full">
                <Button
                  variant="default"
                  className="w-full h-14 font-rounded text-sm uppercase tracking-widest"
                  asChild
                >
                  <Link href="/studio">CMS →</Link>
                </Button>
                <Button
                  variant="secondary"
                  className="w-full h-14 font-rounded text-sm uppercase tracking-widest"
                  asChild
                >
                  <Link href="/brand">Brand →</Link>
                </Button>
                <Button
                  variant="destructive"
                  className="w-full h-14 font-rounded text-sm uppercase tracking-widest"
                  onClick={scrollToTools}
                >
                  Tools →
                </Button>
              </div>

              {/* Desktop: split CMS (top-half) / Brand (bottom-half) */}
              <div className="hidden lg:flex flex-col h-full">
                <div className="flex-1 flex flex-col justify-end p-8 border-b border-border">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    Content Management
                  </p>
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full justify-start font-rounded text-xl uppercase tracking-widest h-16"
                    asChild
                  >
                    <Link href="/studio">CMS →</Link>
                  </Button>
                </div>
                <div className="flex-1 flex flex-col justify-end p-8">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    Visual Identity
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full justify-start font-rounded text-xl uppercase tracking-widest h-16"
                    asChild
                  >
                    <Link href="/brand">Brand →</Link>
                  </Button>
                </div>
              </div>
            </>
          }
          col3={
            <div className="hidden lg:flex flex-col justify-end p-8 h-full">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Asset Tools
              </p>
              <Button
                variant="destructive"
                size="lg"
                className="w-full justify-start font-rounded text-xl uppercase tracking-widest h-16"
                onClick={scrollToTools}
              >
                Tools →
              </Button>
            </div>
          }
        />
      </div>

      {/* ── Tools section ─────────────────────────────────────────────────── */}
      <section
        ref={toolsRef}
        id="tools"
        className="snap-start h-screen flex flex-col"
      >
        {/* Tool — scrolls within the h-screen section */}
        <div className="flex-1 overflow-auto min-h-0">
          {tab === "studio"  && <MultiGenerator />}
          {tab === "compose" && <MultiComposer />}
          {tab === "library" && <AssetLibrary />}
        </div>

        {/* Tab bar — pinned to bottom */}
        <div className="flex border-t border-border shrink-0" style={{ height: 40 }}>
          {(["studio", "compose", "library"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 font-rounded text-xs uppercase tracking-widest border-r border-border last:border-r-0 transition-colors h-full ${
                tab === t
                  ? "bg-foreground text-background"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
