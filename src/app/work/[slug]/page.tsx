import { notFound } from "next/navigation";
import Image from "next/image";
import { client } from "../../../../sanity/lib/client";
import {
  workBySlugQuery,
  allWorkSlugsQuery,
} from "../../../../sanity/lib/queries";
import { urlFor } from "../../../../sanity/lib/image";
import { PageTransitionCurtain } from "@/app/components/PageTransitionCurtain";
import WorkDetailHero from "./WorkDetailHero";

type MediaItem = {
  _key: string;
  _type: "image" | "videoUpload" | "videoUrl";
  asset?: { _ref: string; url?: string };
  aspectRatio?: number;
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

  const media = work.media ?? [];

  function colSpan(item: MediaItem): 1 | 2 | 3 {
    if (item._type !== "image") return 3;
    const ar = item.aspectRatio ?? 1;
    if (ar < 0.8) return 1; // portrait
    if (ar < 1.6) return 2; // landscape
    return 3; // wide / panoramic
  }

  return (
    <>
      <PageTransitionCurtain color={bg} />

      <main className="min-h-screen bg-background">
        {/* Hero — mobile: 2 rows (info + image) | desktop: h-screen cover */}

        <WorkDetailHero
          client={work.client}
          title={work.title}
          categories={work.categories}
          coverImageUrl={work.coverImage?.asset ? urlFor(work.coverImage).width(1920).url() : undefined}
        />

        {/* 3-col section: description + two 9:16 images */}
        {(() => {
          const portraits = (work.media ?? []).filter(
            (m) => m._type === "image" && m.asset,
          );
          const img1 = portraits[0];
          const img2 = portraits[1];
          return (
            <div className="grid grid-cols-2 lg:grid-cols-3 h-auto lg:h-screen">
              {/* Col 1: description */}
              <div className="col-span-2 lg:col-span-1 flex items-center p-8 lg:p-16">
                <p className="font-rounded text-foreground text-xl lg:text-2xl leading-snug">
                  {work.description ??
                    "A creative project built with precision and intent. Strategy and execution, multiplied."}
                </p>
              </div>
              {/* Col 2: first portrait image */}
              <div className="relative overflow-hidden aspect-[9/16] lg:aspect-auto bg-muted">
                {img1?.asset && (
                  <Image
                    src={urlFor(img1).width(600).height(1067).url()}
                    alt={img1.alt ?? work.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              {/* Col 3: second portrait image */}
              <div className="relative overflow-hidden aspect-[9/16] lg:aspect-auto bg-muted">
                {img2?.asset && (
                  <Image
                    src={urlFor(img2).width(600).height(1067).url()}
                    alt={img2.alt ?? work.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          );
        })()}

        {/* Media gallery — 3-col grid */}
        {media.length > 0 && (
          <div className="grid grid-cols-3">
            {media.map((item) => {
              const span = colSpan(item);
              const colClass =
                span === 1
                  ? "col-span-1"
                  : span === 2
                    ? "col-span-2"
                    : "col-span-3";

              if (item._type === "image" && item.asset) {
                const ar = item.aspectRatio ?? 1;
                return (
                  <div
                    key={item._key}
                    className={`${colClass} relative overflow-hidden`}
                    style={{ aspectRatio: ar }}
                  >
                    <Image
                      src={urlFor(item)
                        .width(span === 1 ? 600 : span === 2 ? 1200 : 1800)
                        .url()}
                      alt={item.alt ?? work.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                );
              }

              if (item._type === "videoUpload" && item.file?.asset?.url) {
                return (
                  <div key={item._key} className={`${colClass} aspect-video`}>
                    <video
                      src={item.file.asset.url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              }

              if (item._type === "videoUrl" && item.url) {
                return (
                  <div key={item._key} className={`${colClass} aspect-video`}>
                    <video
                      src={item.url}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              }

              return null;
            })}
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
