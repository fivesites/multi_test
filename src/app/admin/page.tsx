"use client";

import Link from "next/link";
import { useState } from "react";
import MultiGenerator from "@/app/components/MultiGenerator";
import MultiComposer from "@/app/components/MultiComposer";
import { Button } from "@/components/ui/button";

type Tab = "studio" | "compose";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("studio");

  return (
    <main className="min-h-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* Header grid — 6 equal columns */}
      <div className="absolute top-0 left-0 flex   p-8 z-20   ">
        {" "}
        <h1 className="text-4xl font-normal text-background font-rounded">
          Dashboard²
        </h1>
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-3 border-b border-border     h-screen">
        <div className="flex flex-col justify-end h-screen col-span-1 ">
          <Button
            className="w-full h-full justify-start items-end p-8"
            variant="default"
            asChild
          >
            <Link href="/studio">CMS</Link>
          </Button>
        </div>
        <div className="flex flex-col justify-end h-screen col-span-1 ">
          <Button
            className="w-full h-full justify-start items-end p-8 uppercase"
            variant="secondary"
            asChild
          >
            <Link href="/brand">The Brand</Link>
          </Button>
        </div>
        <div className="flex flex-col justify-end h-screen col-span-1 ">
          <Button
            className="w-full h-full justify-start items-end p-8 uppercase"
            variant="destructive"
          >
            TOOLS
          </Button>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex border-b border-border shrink-0"
        style={{ height: 36 }}
      >
        {(["studio", "compose"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 font-rounded text-xs uppercase tracking-widest border-r border-border transition-colors h-full ${
              tab === t
                ? "bg-foreground text-background"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tool — fills remaining height */}
      <div className="flex-1 overflow-hidden">
        {tab === "studio" && <MultiGenerator />}
        {tab === "compose" && <MultiComposer />}
      </div>
    </main>
  );
}
