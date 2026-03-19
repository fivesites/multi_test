"use client";

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

function ImageCol({
  coverImageUrl,
  title,
  priority,
}: {
  coverImageUrl?: string;
  title: string;
  priority?: boolean;
}) {
  return (
    <div className="relative h-full overflow-hidden">
      {coverImageUrl && (
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          className="object-cover"
          priority={priority}
        />
      )}
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
    <div className="relative h-screen">
      {/* Back button */}
      <div className="absolute top-0 left-0 z-20 p-4">
        <Button variant="default" asChild>
          <Link href="/">←</Link>
        </Button>
      </div>

      {/* Mobile: bg-primary top, image bottom */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="bg-primary h-[40vh] flex flex-col items-center justify-center px-6 gap-1">
          <ClientSquared
            texts={[client ?? title]}
            className="font-rounded font-black text-4xl text-primary-foreground"
          />
          <p className="font-rounded text-primary-foreground font-bold text-sm">{title}</p>
          {categories && categories.length > 0 && (
            <p className="font-rounded text-primary-foreground/60 text-xs">
              {categories.join(", ")}
            </p>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <ImageCol coverImageUrl={coverImageUrl} title={title} priority />
        </div>
      </div>

      {/* Desktop: image | bg-primary (center) | image */}
      <div className="hidden lg:grid grid-cols-3 h-full">
        <div className="h-full">
          <ImageCol coverImageUrl={coverImageUrl} title={title} priority />
        </div>

        <div className="bg-primary h-full flex flex-col items-center justify-center px-8 gap-2">
          <ClientSquared
            texts={[client ?? title]}
            className="font-rounded font-black text-5xl text-primary-foreground text-center"
          />
          <p className="font-rounded text-primary-foreground font-bold text-base">{title}</p>
          {categories && categories.length > 0 && (
            <p className="font-rounded text-primary-foreground/60 text-sm">
              {categories.join(", ")}
            </p>
          )}
        </div>

        <div className="h-full">
          <ImageCol coverImageUrl={coverImageUrl} title={title} />
        </div>
      </div>
    </div>
  );
}
