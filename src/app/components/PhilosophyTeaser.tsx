import Link from "next/link";
import { client } from "../../../sanity/lib/client";
import { stickyNotesQuery } from "../../../sanity/lib/queries";
import { PhilosophyTicker } from "./PhilosophyTicker";

export default async function PhilosophyTeaser() {
  const notes: { _id: string; text: string }[] =
    await client.fetch(stickyNotesQuery);

  return (
    <>
      <div className="h-[10vh] bg-secondary flex items-center justify-center ">
        <Link href="/philosophy">
          <h2 className="font-absolution1 text-2xl text-center text-secondary-foreground">
            Read our philosophy
          </h2>
        </Link>
      </div>
      <PhilosophyTicker notes={notes} />
    </>
  );
}
