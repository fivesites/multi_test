"use client";

import Link from "next/link";
import { useSavedAssets } from "@/app/hooks/useSavedAssets";
import HorizontalBorder from "./HorizontalBorder";
import { Button } from "@/components/ui/button";

const ABOUT_TEXT =
  "Multi² is not your typical company. It's a multiplier. Bring the challenge. Leave with multiplied impact. Two creators × multiple roles = more than expected. Strategy and execution under one roof. Ideas don't get diluted. They get sharper. Precision-crafted content, built to deliver maximum impact per investment. From sharpening the brand at Ikea to crafting bold work with Jureskog and ATG, we help brands move faster, think clearer, and create more with less. Small team. Multiplied output.";

export default function AboutSection() {
  const { saved } = useSavedAssets();

  const illustration = [...saved]
    .reverse()
    .find(
      (a) =>
        a.role === "Landing_About" ||
        (a.type === "composition" &&
          (a.label.includes("16:9") || a.label.includes("9:16"))),
    );

  return (
    <section className="snap-start w-full bg-background">
      <HorizontalBorder size="s" />

      <div className="relative grid grid-cols-1 lg:grid-cols-3 min-h-screen">
        {/* Philosophy button — desktop top-left */}
        <div className="hidden lg:block absolute top-0 left-0 z-10">
          <Button variant="default" asChild>
            <Link href="/philosophy">Philosophy</Link>
          </Button>
        </div>

        {/* Col 1: text */}
        <div className="lg:col-span-2 flex items-center justify-start p-4 lg:p-16">
          <p className="text-foreground font-normal leading-tight text-2xl lg:text-3xl max-w-3xl font-rounded">
            {ABOUT_TEXT}
          </p>
        </div>

        {/* Col 3: 9:16 illustration */}
        <div className="relative overflow-hidden bg-secondary min-h-[60vw] lg:min-h-0">
          {illustration?.uploadedAsset ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={illustration.uploadedAsset}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-xs text-muted-foreground">
                9:16
              </span>
            </div>
          )}
        </div>
      </div>

      <HorizontalBorder size="xs" />
    </section>
  );
}
