import { notFound } from "next/navigation";
import { sanityFetch } from "../../../../sanity/lib/client";
import {
  workBySlugQuery,
  allWorkSlugsQuery,
} from "../../../../sanity/lib/queries";
import { urlFor } from "../../../../sanity/lib/image";
import WorkPageClient from "./ProjectPageClient";

export async function generateStaticParams() {
  try {
    const slugs = await sanityFetch<{ slug: string }[]>(allWorkSlugsQuery);
    return slugs.map(({ slug }) => ({ slug }));
  } catch (error) {
    // Sanity unreachable at build time — let the routes render on demand.
    console.error("generateStaticParams: Sanity fetch failed", error);
    return [];
  }
}

type MediaItem = {
  _type: string;
  _key: string;
  asset?: unknown;
  aspectRatio?: number;
};

type PtChild = { text?: string };
type PtBlock = { _type: string; children?: PtChild[] };

function ptToText(value: unknown): string | undefined {
  if (typeof value === "string") return value || undefined;
  if (!Array.isArray(value)) return undefined;
  const text = (value as PtBlock[])
    .filter((b) => b._type === "block" && Array.isArray(b.children))
    .map((b) => b.children!.map((c) => c.text ?? "").join(""))
    .join("\n");
  return text || undefined;
}

type WorkData = {
  _id: string;
  title: string;
  client?: string;
  description?: unknown;
  credits?: unknown;
  categories?: string[];
  year?: number;
  slug: { current: string };
  coverImage?: { asset?: unknown };
  media?: MediaItem[];
};

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await sanityFetch<WorkData | null>(workBySlugQuery, { slug });
  if (!work) notFound();

  const images = (work.media ?? [])
    .filter((m) => m._type === "image" && m.asset)
    .map((img) => ({
      key: img._key,
      url: urlFor(img).width(1600).quality(85).url(),
      aspectRatio: img.aspectRatio ?? 1,
    }));

  // The work's own cover asset, if it has one — the page falls back to the
  // first media image otherwise.
  const coverUrl = work.coverImage?.asset
    ? urlFor(work.coverImage).width(1600).quality(85).url()
    : undefined;

  return (
    <WorkPageClient
      title={work.title}
      client={work.client}
      slug={slug}
      description={ptToText(work.description)}
      credits={ptToText(work.credits)}
      categories={work.categories ?? []}
      year={work.year}
      images={images}
      coverUrl={coverUrl}
    />
  );
}
