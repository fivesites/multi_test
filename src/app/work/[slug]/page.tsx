import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import {
  workBySlugQuery,
  allWorkSlugsQuery,
} from "../../../../sanity/lib/queries";
import { urlFor } from "../../../../sanity/lib/image";
import { Button } from "@/components/ui/button";
import HeroText from "@/app/components/HeroText";

type MediaItem = {
  _key: string;
  _type: "image" | "videoUpload" | "videoUrl";
  // image
  asset?: { _ref: string; url?: string };
  hotspot?: object;
  crop?: object;
  alt?: string;
  caption?: string;
  // videoUpload
  file?: { asset?: { url: string } };
  // videoUrl
  url?: string;
};

type WorkDetail = {
  _id: string;
  title: string;
  slug: { current: string };
  client?: string;
  year?: number;
  categories?: string[];
  backgroundColor?: string;
  description?: string;
  credits?: string;
  coverImage?: { asset: { _ref: string }; hotspot?: object; crop?: object };
  media?: MediaItem[];
};

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(allWorkSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work: WorkDetail | null = await client.fetch(workBySlugQuery, { slug });

  if (!work) notFound();

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: work.backgroundColor ?? "var(--background)" }}
    >
      {/* Header */}
      <div className="px-6 pt-24 pb-12">
        <Button variant="link" asChild>
          <Link
            href="/work"
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Back
          </Link>
        </Button>
        <div className="h-[80vh] w-full flex items-center justify-center">
          <h1 className="text-4xl lg:text-6xl font-absolution1">
            <HeroText
              triggerOnView
              texts={[work.title]}
              displayedText={work.title}
            />
          </h1>
        </div>

        <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="text-sm text-muted-foreground space-y-1 md:text-right font-mono">
            {work.client && <p>{work.client}</p>}
            {work.year && <p>{work.year}</p>}
            {work.categories && work.categories.length > 0 && (
              <p className="uppercase tracking-wider">
                {work.categories.join(" · ")}
              </p>
            )}
          </div>
        </div>

        {work.description && (
          <p className="mt-8 max-w-2xl text-muted-foreground leading-relaxed">
            {work.description}
          </p>
        )}
      </div>

      {/* Cover image */}
      {work.coverImage?.asset && (
        <div className="px-6 mb-2">
          <div className="aspect-video overflow-hidden">
            <Image
              src={urlFor(work.coverImage).width(1600).height(900).url()}
              alt={work.title}
              width={1600}
              height={900}
              priority
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Media gallery */}
      {work.media && work.media.length > 0 && (
        <div className="px-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          {work.media.map((item) => {
            if (item._type === "image" && item.asset) {
              return (
                <figure key={item._key}>
                  <Image
                    src={urlFor(item).width(1200).url()}
                    alt={item.alt ?? work.title}
                    width={1200}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                  {item.caption && (
                    <figcaption className="mt-2 text-xs text-muted-foreground">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }

            if (item._type === "videoUpload" && item.file?.asset?.url) {
              return (
                <figure key={item._key}>
                  <video
                    src={item.file.asset.url}
                    controls
                    className="w-full"
                    playsInline
                  />
                  {item.caption && (
                    <figcaption className="mt-2 text-xs text-muted-foreground">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }

            if (item._type === "videoUrl" && item.url) {
              return (
                <figure key={item._key}>
                  <video
                    src={item.url}
                    controls
                    className="w-full"
                    playsInline
                  />
                  {item.caption && (
                    <figcaption className="mt-2 text-xs text-muted-foreground">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* Credits */}
      {work.credits && (
        <div className="px-6 mt-16 pb-24">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Credits
          </h2>
          <p className="text-sm whitespace-pre-line">{work.credits}</p>
        </div>
      )}
    </main>
  );
}
