import React from "react";
import { client } from "../../sanity/lib/client";
import { workCardsQuery } from "../../sanity/lib/queries";
import { urlFor } from "../../sanity/lib/image";
import { WorkProvider, type GridItem } from "./WorkContext";

type MediaItem = {
  _type: string;
  _key: string;
  asset?: unknown;
  aspectRatio?: number;
};

type WorkData = {
  _id: string;
  title: string;
  client?: string;
  year?: number;
  credits?: unknown;
  description?: string;
  categories?: string[];
  slug: string;
  coverImage?: { asset: { _ref: string }; aspectRatio?: number };
  media?: MediaItem[];
};

export async function WorkContextServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const works = await client.fetch<WorkData[]>(workCardsQuery);

  const items: GridItem[] = [];
  const categorySet = new Set<string>();

  for (const work of works) {
    for (const cat of work.categories ?? []) {
      categorySet.add(cat);
    }

    const allImages = (work.media ?? []).filter(
      (m) => m._type === "image" && m.asset,
    );

    const projectImages = allImages.map((img) => ({
      key: img._key,
      url: urlFor(img).width(1200).quality(80).url(),
      aspectRatio: img.aspectRatio ?? 1,
    }));

    const displayImages = allImages.slice(0, 3);

    if (displayImages.length > 0) {
      displayImages.forEach((img, idx) => {
        items.push({
          key: `${work._id}-${img._key}`,
          url: urlFor(img).width(1200).quality(80).url(),
          alt: work.client || work.title,
          slug: work.slug,
          title: work.title,
          client: work.client,
          year: work.year,
          credits: work.credits,
          description: work.description,
          categories: work.categories ?? [],
          aspectRatio: img.aspectRatio ?? 1,
          isPrimary: idx === 0,
          projectImages,
        });
      });
    } else if (work.coverImage?.asset) {
      const coverUrl = urlFor(work.coverImage).width(1200).quality(80).url();
      items.push({
        key: work._id,
        url: coverUrl,
        alt: work.client || work.title,
        slug: work.slug,
        title: work.title,
        client: work.client,
        year: work.year,
        credits: work.credits,
        description: work.description,
        categories: work.categories ?? [],
        aspectRatio: work.coverImage.aspectRatio ?? 1,
        isPrimary: true,
        projectImages: [
          {
            key: work._id,
            url: coverUrl,
            aspectRatio: work.coverImage.aspectRatio ?? 1,
          },
        ],
      });
    }
  }

  const categories = Array.from(categorySet).sort();

  return (
    <WorkProvider items={items} categories={categories}>
      {children}
    </WorkProvider>
  );
}
