"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUI } from "@/context/UIContext";
import type { GridItem } from "@/context/WorkContext";
import { formatCategories } from "@/lib/categories";
import { Button } from "@/components/ui/button";

export default function ProjectCard({
  item,
  sizes,
  className = "",
}: {
  item: GridItem;
  sizes: string;
  className?: string;
}) {
  const categories = formatCategories(item.categories);
  const { openedCard, setOpenedCard } = useUI();
  // Clicking hands off to the project page, which can take a beat to load.
  // Until it does, the card claims the whole tile and centres its own label.
  const isOpened = openedCard === item.slug;

  return (
    <Link
      href={`/projects/${item.slug}`}
      onClick={() => setOpenedCard(item.slug)}
      className={cn(
        "relative group flex flex-col  aspect-square justify-center  items-center ",
        className,
      )}
    >
      <div className="relative h-full aspect-square overflow-hidden ">
        {/* group-hover, not hover: the scale should follow the whole card.
            overflow-hidden on the parent crops the growth instead of letting
            it push into the neighbouring masonry column. */}
        <Image
          src={item.url}
          alt={item.alt}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes={sizes}
        />
      </div>
      {/* Absolute, so revealing these on hover can't reflow the masonry */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-full flex flex-col items-center justify-center font-diatype font-medium p-6 text-primary-foreground text-sm leading-snug tracking-wide",
          "opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:bg-secondary group-focus-visible:bg-secondary",
        )}
      >
        <Button className="h-auto w-min bg-background text-primary hover:bg-primary hover:text-primary-foreground whitespace-nowrap">
          {item.title}
        </Button>
      </div>
    </Link>
  );
}
