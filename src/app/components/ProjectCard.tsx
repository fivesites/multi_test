"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePixelCorners } from "@/app/hooks/usePixelCorners";
import { useUI } from "@/context/UIContext";
import type { GridItem } from "@/context/WorkContext";
import CheckButton from "./CheckButton";

export default function ProjectCard({
  item,
  sizes,
  className = "",
}: {
  item: GridItem;
  sizes: string;
  className?: string;
}) {
  // Notches the box's corners like the buttons and landing blocks — on the
  // media box so the image is clipped to the shape, with the caption below it.
  const pixelRef = usePixelCorners<HTMLDivElement>();
  const captionRef = usePixelCorners<HTMLDivElement>();
  const { setOpenedCard, numCols } = useUI();

  // The caption only earns its space when the thumbnails are large enough to
  // sit beside it — the 1- and 3-column zoom stops. Past that the grid is a
  // dense contact sheet and the label would crowd it.
  const showCaption = numCols <= 3;

  return (
    <Link
      href={`/projects/${item.slug}`}
      onClick={() => setOpenedCard(item.slug)}
      className={cn("group flex flex-col gap-0 w-full mb-6 lg:mb-3", className)}
    >
      <div
        ref={pixelRef}
        className="pixelCorners relative flex flex-col w-full aspect-square justify-center items-center overflow-hidden"
      >
        <div className="relative h-full aspect-square overflow-hidden ">
          {/* group-hover, not hover: the scale should follow the whole card.
              overflow-hidden on the parent crops the growth instead of letting
              it push into the neighbouring masonry column. */}
          <Image
            src={item.url}
            alt={item.alt}
            fill
            className="object-cover "
            sizes={sizes}
          />
        </div>
      </div>
      {/* Client + title below the image — client in pText, title in h4BtnText.
          The frame's border follows the notched corners, not a plain rectangle. */}
      {showCaption && item.client && (
        <div
          ref={captionRef}
          className="flex flex-col gap-1 lg:gap-2 w-full py-6 px-3  text-primary   "
        >
          <CheckButton label={item.client} active size="label" className="" />
          <span className="h4BtnText text-primary lowercase hidden ">
            {item.title}
          </span>
        </div>
      )}
    </Link>
  );
}
