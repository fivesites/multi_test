import { client } from "../../../sanity/lib/client";
import { workCardsQuery } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";
import { WorkCard } from "./WorkCard";
import HorizontalBorder from "./HorizontalBorder";

type MediaItem = {
  _type: "image" | "videoUpload" | "videoUrl";
  _key: string;
  asset?: { url?: string };
  aspectRatio?: number;
  aspectRatioType?: "portrait" | "cube" | "landscape";
  file?: { asset?: { url?: string } };
  url?: string;
};

type WorkCardData = {
  _id: string;
  title: string;
  client?: string;
  categories?: string[];
  slug: string;
  backgroundColor?: string;
  coverImage?: { asset: { _ref: string }; aspectRatio?: number };
  media?: MediaItem[];
};

function buildSlides(work: WorkCardData) {
  // Only portrait images for tall WorkCards
  const portraitMedia = (work.media ?? []).filter(
    (item) => item._type === "image" && item.asset && item.aspectRatioType === "portrait",
  );

  if (portraitMedia.length > 0) {
    return portraitMedia.map((item) => ({
      type: "image" as const,
      url: urlFor(item).width(600).height(1067).url(),
    }));
  }

  // Fallback: cover image only
  if (work.coverImage?.asset) {
    return [{ type: "image" as const, url: urlFor(work.coverImage).width(600).height(1067).url() }];
  }

  return [];
}

export default async function WorkSection() {
  const works: WorkCardData[] = await client.fetch(workCardsQuery);

  if (!works.length) return null;

  const visible = works.slice(0, 3);

  return (
    <section className="snap-start w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {visible.flatMap((work, i) => [
          i > 0 && (
            <div key={`border-${work._id}`} className="lg:hidden">
              <HorizontalBorder size="xs" />
            </div>
          ),
          <WorkCard
            key={work._id}
            title={work.title}
            client={work.client}
            categories={work.categories}
            slug={work.slug}
            backgroundColor={work.backgroundColor}
            slides={buildSlides(work)}
            className="h-screen snap-start"
          />,
        ])}
      </div>
    </section>
  );
}
