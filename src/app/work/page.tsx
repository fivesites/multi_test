import { client } from "../../../sanity/lib/client";
import { workCardsQuery } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";
import { WorkCard } from "@/app/components/WorkCard";

export const revalidate = 60;

type MediaItem = {
  _type: "image" | "videoUpload" | "videoUrl";
  _key: string;
  asset?: { url?: string };
  file?: { asset?: { url?: string } };
  url?: string;
};

type WorkCardData = {
  _id: string;
  title: string;
  slug: string;
  backgroundColor?: string;
  coverImage?: { asset: { _ref: string } };
  media?: MediaItem[];
};

function buildSlides(work: WorkCardData) {
  const slides: { type: "image" | "video"; url: string }[] = [];

  if (work.coverImage?.asset) {
    slides.push({
      type: "image",
      url: urlFor(work.coverImage).width(900).height(506).url(),
    });
  }

  for (const item of work.media ?? []) {
    if (item._type === "image" && item.asset) {
      slides.push({ type: "image", url: urlFor(item).width(900).height(506).url() });
    } else if (item._type === "videoUpload" && item.file?.asset?.url) {
      slides.push({ type: "video", url: item.file.asset.url });
    }
  }

  return slides;
}

export default async function WorkPage() {
  const works: WorkCardData[] = await client.fetch(workCardsQuery);

  if (!works.length) return null;

  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {works.map((work) => (
          <WorkCard
            key={work._id}
            title={work.title}
            slug={work.slug}
            backgroundColor={work.backgroundColor}
            slides={buildSlides(work)}
          />
        ))}
      </div>
    </main>
  );
}
