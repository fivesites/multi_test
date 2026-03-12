import Link from "next/link";
import Image from "next/image";
import { client } from "../../../sanity/lib/client";
import { allWorkQuery } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";

type WorkEntry = {
  _id: string;
  title: string;
  slug: { current: string };
  client?: string;
  year?: number;
  categories?: string[];
  backgroundColor?: string;
  coverImage?: { asset: { _ref: string }; hotspot?: object; crop?: object };
};

export const revalidate = 60;

export default async function WorkPage() {
  const works: WorkEntry[] = await client.fetch(allWorkQuery);

  return (
    <main className="min-h-screen bg-background px-6 pt-24 pb-16">
      <h1 className="text-sm uppercase tracking-widest text-muted-foreground mb-12">
        Work
      </h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {works.map((work) => (
          <li key={work._id}>
            <Link
              href={`/work/${work.slug.current}`}
              className="group block p-6 h-full transition-colors duration-300"
              style={{ backgroundColor: work.backgroundColor ?? "transparent" }}
            >
              {work.coverImage?.asset && (
                <div className="aspect-video overflow-hidden mb-4">
                  <Image
                    src={urlFor(work.coverImage).width(800).height(450).url()}
                    alt={work.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-base font-medium">{work.title}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {work.year}
                </span>
              </div>
              {work.client && (
                <p className="text-sm text-muted-foreground mt-1">
                  {work.client}
                </p>
              )}
              {work.categories && work.categories.length > 0 && (
                <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
                  {work.categories.join(" · ")}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {works.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No projects yet. Add some in the{" "}
          <Link href="/studio" className="underline">
            studio
          </Link>
          .
        </p>
      )}
    </main>
  );
}
