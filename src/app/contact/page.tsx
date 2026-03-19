import Link from "next/link";
import { client } from "../../../sanity/lib/client";
import { copyByKeyQuery } from "../../../sanity/lib/queries";
import MultiText from "../components/MultiText";

export const revalidate = 60;

export default async function ContactPage() {
  const copy = await client
    .fetch(copyByKeyQuery, { key: "contact-email" })
    .catch(() => null);

  const email: string = copy?.plainText ?? "hello@multi2.se";

  return (
    <main className="min-h-screen bg-primary flex flex-col">
      {/* Back */}
      <div className="p-4">
        <Link
          href="/"
          className="font-rounded text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
        >
          ←
        </Link>
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8 text-center">
        <MultiText className="text-primary-foreground" frozen />

        <a
          href={`mailto:${email}`}
          className="font-rounded font-black text-3xl lg:text-5xl text-primary-foreground hover:opacity-70 transition-opacity"
        >
          {email}
        </a>
      </div>
    </main>
  );
}
