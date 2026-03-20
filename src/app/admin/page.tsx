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
      <div className="grid grid-cols-3 border-b border-border h-screen">
        <Button
          variant="default"
          size="lg"
          className="rounded-none font-rounded text-lg uppercase tracking-widest w-full h-full"
          asChild
        >
          <Link href="/studio">CMS</Link>
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="rounded-none font-rounded text-lg uppercase tracking-widest w-full h-full"
          asChild
        >
          <Link href="/brand">Brand</Link>
        </Button>
        <Button
          variant="destructive"
          size="lg"
          className="rounded-none font-rounded text-lg uppercase tracking-widest w-full h-full"
          onClick={() =>
            toolsRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Tools
        </Button>
      </div>

      {/* ── Tools section ─────────────────────────────────────────────────── */}
      <section ref={toolsRef} id="tools" className="h-screen flex flex-col">
        <div className="flex-1 overflow-auto min-h-0">
          {tab === "studio" && <MultiGenerator />}
          {tab === "compose" && <MultiComposer />}
          {tab === "library" && <AssetLibrary />}
        </div>

        <div className="flex   shrink-0">
          {(["studio", "compose", "library"] as Tab[]).map((t) => (
            <Button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 font-rounded  uppercase tracking-widest  text-xl   last:border-r-0 transition-colors h-[3rem]  ${
                tab === t
                  ? "bg-foreground text-background"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {t}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
