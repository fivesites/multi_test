import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
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
  aspectRatioType?: "portrait" | "cube" | "landscape";
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
  description?: string;
  imagesPerPage?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  credits?: any[];
  coverImage?: { asset: { _ref: string }; hotspot?: object; crop?: object };
  media?: MediaItem[];
};

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(allWorkSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

const creditsComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <li className="text-sm font-mono text-foreground/60 leading-relaxed">{children}</li>
    ),
  },
};

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work: WorkDetail | null = await client.fetch(workBySlugQuery, { slug });

  if (!work) notFound();

  const media = work.media ?? [];
  const imagesPerPage = work.imagesPerPage ?? media.length;
  const visibleMedia = media.slice(0, imagesPerPage);

  // Hero: prefer a landscape image, fallback to first image
  const heroImage =
    media.find((m) => m._type === "image" && m.asset && m.aspectRatioType === "landscape") ??
    media.find((m) => m._type === "image" && m.asset) ??
    (work.coverImage?.asset ? work.coverImage : undefined);
  const coverImageUrl = heroImage?.asset
    ? urlFor(heroImage).width(1920).url()
    : work.coverImage?.asset
      ? urlFor(work.coverImage).width(1920).url()
      : undefined;

  // Desktop gallery: portrait = col-span-1, landscape = col-span-2, video = col-span-3
  // Mobile gallery: cube = col-span-1, portrait/landscape = col-span-2
  function desktopSpan(item: MediaItem): 1 | 2 | 3 {
    if (item._type !== "image") return 3;
    if (item.aspectRatioType === "portrait") return 1;
    if (item.aspectRatioType === "landscape") return 2;
    if (item.aspectRatioType === "cube") return 2;
    // fallback: use computed ratio
    const ar = item.aspectRatio ?? 1;
    if (ar < 0.8) return 1;
    if (ar < 1.6) return 2;
    return 3;
  }

  function mobileSpan(item: MediaItem): 1 | 2 {
    if (item._type !== "image") return 2;
    if (item.aspectRatioType === "cube") return 1;
    return 2;
  }

  return (
    <>
      <PageTransitionCurtain color="#111111" />

      <main className="min-h-screen bg-background overflow-y-scroll snap-y snap-mandatory">
        <WorkDetailHero
          client={work.client}
          title={work.title}
          categories={work.categories}
          coverImageUrl={coverImageUrl}
        />

        {/* Description section */}
        <div className="snap-start flex items-center p-8 lg:p-16 min-h-[50vh]">
          <p className="font-rounded text-foreground text-xl lg:text-2xl leading-snug max-w-2xl">
            {work.description ??
              "A creative project built with precision and intent. Strategy and execution, multiplied."}
          </p>
        </div>

        {/* Media gallery — 3-col desktop, 2-col mobile */}
        {visibleMedia.length > 0 && (
          <div className="snap-start grid grid-cols-2 lg:grid-cols-3">
            {visibleMedia.map((item) => {
              const dSpan = desktopSpan(item);
              const mSpan = mobileSpan(item);

              const colClass = [
                mSpan === 1 ? "col-span-1" : "col-span-2",
                dSpan === 1
                  ? "lg:col-span-1"
                  : dSpan === 2
                    ? "lg:col-span-2"
                    : "lg:col-span-3",
              ].join(" ");

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
                        .width(dSpan === 1 ? 900 : dSpan === 2 ? 1600 : 2400)
                        .url()}
                      alt={item.alt ?? work.title}
                      fill
                      sizes={
                        dSpan === 1
                          ? "(max-width: 1024px) 50vw, 33vw"
                          : dSpan === 2
                            ? "(max-width: 1024px) 100vw, 66vw"
                            : "100vw"
                      }
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
        {work.credits && work.credits.length > 0 && (
          <div className="snap-start px-6 py-16 pb-32">
            <h2 className="font-absolution1 text-xs uppercase tracking-widest text-foreground/40 mb-4">
              Credits
            </h2>
            <ul className="space-y-1 max-w-md">
              <PortableText value={work.credits} components={creditsComponents} />
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
