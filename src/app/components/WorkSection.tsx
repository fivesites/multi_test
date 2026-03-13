import { client } from "../../../sanity/lib/client";
import { workCardsQuery } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";
import { WorkCard } from "./WorkCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      const url = urlFor(item).width(900).height(506).url();
      slides.push({ type: "image", url });
    } else if (item._type === "videoUpload" && item.file?.asset?.url) {
      slides.push({ type: "video", url: item.file.asset.url });
    }
    // videoUrl (YouTube/Vimeo) — skip; not embeddable in <video>
  }

  return slides;
}

export default async function WorkSection() {
  const works: WorkCardData[] = await client.fetch(workCardsQuery);

  if (!works.length) return null;

  const visible = works.slice(0, 4);

  return (
    <section className="snap-start w-full relative">
      {/* Button floats over the grid */}
      <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
        <Button variant="ghost" size="lg" asChild className="pointer-events-auto">
          <Link href="/work">See our work</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {visible.map((work) => (
          <WorkCard
            key={work._id}
            title={work.title}
            slug={work.slug}
            backgroundColor={work.backgroundColor}
            slides={buildSlides(work)}
            className="aspect-square"
          />
        ))}
      </div>
    </section>
  );
}
