"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import MultiGenerator from "@/app/components/MultiGenerator";
import MultiComposer from "@/app/components/MultiComposer";
import AssetLibrary from "@/app/components/AssetLibrary";
import { Button } from "@/components/ui/button";

type Tab = "studio" | "compose" | "library";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("studio");
  const toolsRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 border-b border-border">
        <Button variant="default" size="lg" className="rounded-none h-16 font-rounded text-lg uppercase tracking-widest" asChild>
          <Link href="/studio">CMS</Link>
        </Button>
        <Button variant="secondary" size="lg" className="rounded-none h-16 font-rounded text-lg uppercase tracking-widest border-x border-border" asChild>
          <Link href="/brand">Brand</Link>
        </Button>
        <Button variant="destructive" size="lg" className="rounded-none h-16 font-rounded text-lg uppercase tracking-widest" onClick={() => toolsRef.current?.scrollIntoView({ behavior: "smooth" })}>
          Tools
        </Button>
      </div>

      {/* ── Tools section ─────────────────────────────────────────────────── */}
      <section ref={toolsRef} id="tools" className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex-1 overflow-auto min-h-0">
          {tab === "studio"  && <MultiGenerator />}
          {tab === "compose" && <MultiComposer />}
          {tab === "library" && <AssetLibrary />}
        </div>

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
