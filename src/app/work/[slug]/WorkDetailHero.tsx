"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClientSquared from "@/app/components/ClientSquared";

interface Props {
  client?: string;
  title: string;
  categories?: string[];
  coverImageUrl?: string;
}

function ImageCol({ coverImageUrl, title, priority }: { coverImageUrl?: string; title: string; priority?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative h-full overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {coverImageUrl && (
        <Image src={coverImageUrl} alt={title} fill className="object-cover" priority={priority} />
      )}
      <div
        className="absolute inset-0 bg-primary pointer-events-none transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0 }}
      />
    </div>
  );
}

export default function WorkDetailHero({ client, title, categories, coverImageUrl }: Props) {
  return (
    <div className="relative">
      {/* Back button — top-left, above both layouts */}
      <div className="absolute top-0 left-0 z-20 p-4">
        <Button variant="default" asChild><Link href="/">←</Link></Button>
      </div>

      {/* Mobile: primary row + image row */}
      <div className="lg:hidden">
        <div className="bg-primary h-[50vh] flex items-center justify-center relative">
          <ClientSquared
            texts={[client ?? title]}
            className="font-rounded font-black text-4xl text-primary-foreground"
          />
        </div>
        {coverImageUrl && (
          <div className="relative h-[50vh] w-full overflow-hidden">
            <Image src={coverImageUrl} alt={title} fill className="object-cover" priority />
          </div>
        )}
      </div>

      {/* Desktop: 3-col h-screen */}
      <div className="hidden lg:grid grid-cols-3 h-screen">
        <ImageCol coverImageUrl={coverImageUrl} title={title} priority />

        {/* Middle: bg-primary + ClientSquared */}
        <div className="relative bg-primary flex items-center justify-center">
          <ClientSquared
            texts={[client ?? title]}
            className="font-rounded font-black text-4xl lg:text-6xl text-primary-foreground"
          />
          {/* Bottom meta */}
          <div className="absolute bottom-0 left-0 right-0 grid grid-cols-1 gap-1 p-6">
            <p className="font-rounded text-primary-foreground/60 text-sm">{client}</p>
            <p className="font-rounded text-primary-foreground font-bold">{title}</p>
            <p className="font-rounded text-primary-foreground/60 text-sm">{categories?.join(", ")}</p>
          </div>
        </div>

        <ImageCol coverImageUrl={coverImageUrl} title={title} />
      </div>
    </div>
  );
}
