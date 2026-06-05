import Image from "next/image";
import { client } from "../../../sanity/lib/client";
import { copyByKeyQuery } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";

export default async function AboutSection() {
  const copy = await client.fetch(copyByKeyQuery, { key: "about-intro" });
  const text: string =
    copy?.plainText ??
    (copy?.body?.[0]?.children?.[0]?.text as string | undefined) ??
    "";
  const imageUrl = copy?.image?.asset
    ? urlFor(copy.image).width(1200).url()
    : null;

  return (
    <section className="snap-start w-full bg-background">
      <div className="relative grid grid-cols-1 lg:grid-cols-3 min-h-screen">
        <div className="lg:col-span-2 flex items-center justify-start p-4 lg:p-16">
          <p className="text-foreground font-normal leading-tight text-2xl lg:text-3xl max-w-3xl font-visual">
            {text}
          </p>
        </div>

        {imageUrl && (
          <div className="relative overflow-hidden min-h-[50vw] lg:min-h-0">
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
