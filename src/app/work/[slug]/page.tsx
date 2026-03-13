import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import {
  workBySlugQuery,
  allWorkSlugsQuery,
} from "../../../../sanity/lib/queries";
import { urlFor } from "../../../../sanity/lib/image";
import { PageTransitionCurtain } from "@/app/components/PageTransitionCurtain";
import { Button } from "@/components/ui/button";
import WorkDetailHeader from "./WorkDetailHeader";

type MediaItem = {
  _key: string;
  _type: "image" | "videoUpload" | "videoUrl";
  asset?: { _ref: string; url?: string };
  hotspot?: object;
  crop?: object;
  alt?: string;
  caption?: string;
  file?: { asset?: { url: string } };
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

  const bg = work.backgroundColor ?? "#111111";

  // Group media into full-width or 2-col pairs
  const media = work.media ?? [];
  const groups: { items: MediaItem[]; cols: 1 | 2 }[] = [];
  let i = 0;
  while (i < media.length) {
    const curr = media[i];
    const next = media[i + 1];
    if (curr._type === "image" && next?._type === "image") {
      groups.push({ items: [curr, next], cols: 2 });
      i += 2;
    } else {
      groups.push({ items: [curr], cols: 1 });
      i += 1;
    }
  }

  return (
    <>
      <PageTransitionCurtain color={bg} />

      <main className="min-h-screen bg-background">
        {/* Back link */}
        <div className="absolute top-0 left-0 px-6 pt-3">
          <Button
            variant="link"
            asChild
            className="text-foreground/40 hover:text-foreground px-0"
          >
            <Link href="/">← Back</Link>
          </Button>
        </div>

        {/* 3-col header */}
        <WorkDetailHeader
          title={work.title}
          client={work.client}
          year={work.year}
          categories={work.categories}
        />

        {/* Cover image — full bleed */}
        {work.coverImage?.asset && (
          <div className="w-full aspect-video h-[80vh] overflow-hidden">
            <Image
              src={urlFor(work.coverImage).width(1600).height(900).url()}
              alt={work.title}
              width={1600}
              height={900}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Description */}
        {work.description && (
          <div className="px-6 py-16 max-w-2xl">
            <p className="text-base leading-relaxed text-foreground/70">
              {work.description}
            </p>
          </div>
        )}

        {/* Media gallery */}
        {groups.length > 0 && (
          <div className="flex flex-col">
            {groups.map((group, gi) =>
              group.cols === 2 ? (
                <div key={gi} className="grid grid-cols-2">
                  {group.items.map((item) => (
                    <div key={item._key} className="overflow-hidden">
                      <Image
                        src={urlFor(item).width(900).url()}
                        alt={item.alt ?? work.title}
                        width={900}
                        height={900}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div key={gi} className="w-full overflow-hidden">
                  {(() => {
                    const item = group.items[0];
                    if (item._type === "image" && item.asset) {
                      return (
                        <Image
                          src={urlFor(item).width(1600).url()}
                          alt={item.alt ?? work.title}
                          width={1600}
                          height={900}
                          className="w-full object-cover"
                        />
                      );
                    }
                    if (item._type === "videoUpload" && item.file?.asset?.url) {
                      return (
                        <video
                          src={item.file.asset.url}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full"
                        />
                      );
                    }
                    if (item._type === "videoUrl" && item.url) {
                      return (
                        <video
                          src={item.url}
                          controls
                          playsInline
                          className="w-full"
                        />
                      );
                    }
                    return null;
                  })()}
                </div>
              ),
            )}
          </div>
        )}

        {/* Credits */}
        {work.credits && (
          <div className="px-6 py-16 pb-32">
            <h2 className="font-absolution1 text-xs uppercase tracking-widest text-foreground/40 mb-4">
              Credits
            </h2>
            <p className="text-sm font-mono text-foreground/60 whitespace-pre-line max-w-md leading-relaxed">
              {work.credits}
            </p>
          </div>
        )}
      </main>
    </>
  );
}
