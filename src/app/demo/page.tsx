import { client } from "../../../sanity/lib/client";
import { workCardsQuery } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";
import DemoClient, { type GridItem } from "./DemoClient";

export const revalidate = 60;

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
  categories?: string[];
  slug: string;
  coverImage?: { asset: { _ref: string }; aspectRatio?: number };
  media?: MediaItem[];
};

export default async function DemoPage() {
  const works: WorkData[] = await client.fetch(workCardsQuery);

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
      url: urlFor(img).width(1600).quality(90).url(),
      aspectRatio: img.aspectRatio ?? 1,
    }));

    const displayImages = allImages.slice(0, 3);

    if (displayImages.length > 0) {
      displayImages.forEach((img, idx) => {
        items.push({
          key: `${work._id}-${img._key}`,
          url: urlFor(img).width(1600).quality(90).url(),
          alt: work.client || work.title,
          slug: work.slug,
          title: work.title,
          client: work.client,
          categories: work.categories ?? [],
          aspectRatio: img.aspectRatio ?? 1,
          isPrimary: idx === 0,
          projectImages,
        });
      });
    } else if (work.coverImage?.asset) {
      const coverUrl = urlFor(work.coverImage).width(1600).quality(90).url();
      items.push({
        key: work._id,
        url: coverUrl,
        alt: work.client || work.title,
        slug: work.slug,
        title: work.title,
        client: work.client,
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
    <div className="">
      <DemoClient items={items} categories={categories} />
    </div>
  );
}
