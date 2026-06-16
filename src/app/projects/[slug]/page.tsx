import { notFound } from "next/navigation";
import { client } from "../../../../sanity/lib/client";
import { workBySlugQuery, allWorkSlugsQuery } from "../../../../sanity/lib/queries";
import { urlFor } from "../../../../sanity/lib/image";
import WorkPageClient from "./WorkPageClient";

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allWorkSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
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
  media?: MediaItem[];
};

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await client.fetch<WorkData | null>(workBySlugQuery, { slug });
  if (!work) notFound();

  const images = (work.media ?? [])
    .filter((m) => m._type === "image" && m.asset)
    .map((img) => ({
      key: img._key,
      url: urlFor(img).width(1600).quality(85).url(),
      aspectRatio: img.aspectRatio ?? 1,
    }));

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
    />
  );
}
