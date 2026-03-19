"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClientSquared from "@/app/components/ClientSquared";
import HeroHeader from "@/app/components/HeroHeader";

interface Props {
  client?: string;
  title: string;
  categories?: string[];
  coverImageUrl?: string;
}

function ImageCol({
  coverImageUrl,
  title,
  priority,
}: {
  coverImageUrl?: string;
  title: string;
  priority?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative h-full overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {coverImageUrl && (
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          className="object-cover"
          priority={priority}
        />
      )}
      <div
        className="absolute inset-0 bg-primary pointer-events-none transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0 }}
      />
    </div>
  );
}

export default function WorkDetailHero({
  client,
  title,
  categories,
  coverImageUrl,
}: Props) {
  return (
    <div className="relative">
      {/* Back button — absolute overlay, visible on all breakpoints */}
      <div className="absolute top-0 left-0 z-20 p-4">
        <Button variant="default" asChild>
          <Link href="/">←</Link>
        </Button>
      </div>

      <HeroHeader
        primary={
          <ClientSquared
            texts={[client ?? title]}
            className="font-rounded font-black text-4xl lg:text-6xl text-primary-foreground"
          />
        }
        primaryMeta={
          <div className="p-6 grid grid-cols-1 gap-1">
            <p className="font-rounded text-primary-foreground/60 text-sm">
              {client}
            </p>
            <p className="font-rounded text-primary-foreground font-bold">
              {title}
            </p>
            <p className="font-rounded text-primary-foreground/60 text-sm">
              {categories?.join(", ")}
            </p>
          </div>
        }
        col2={
          <ImageCol
            coverImageUrl={coverImageUrl}
            title={title}
            priority
          />
        }
        col3={<ImageCol coverImageUrl={coverImageUrl} title={title} />}
      />
    </div>
  );
}
