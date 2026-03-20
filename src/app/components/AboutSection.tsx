import HorizontalBorder from "./HorizontalBorder";
import { client } from "../../../sanity/lib/client";
import { copyByKeyQuery } from "../../../sanity/lib/queries";

export default async function AboutSection() {
  const copy = await client.fetch(copyByKeyQuery, { key: "about-intro" });
  const text: string =
    copy?.plainText ??
    (copy?.body?.[0]?.children?.[0]?.text as string | undefined) ??
    "";

  return (
    <section className="snap-start w-full bg-background">
      <div className="relative grid grid-cols-1 lg:grid-cols-3 min-h-screen">
        <div className="lg:col-span-2 flex items-center justify-start p-4 lg:p-16">
          <p className="text-foreground font-normal leading-tight text-2xl lg:text-3xl max-w-3xl font-rounded">
            {text}
          </p>
        </div>
      </div>

      <HorizontalBorder size="xs" />
    </section>
  );
}
