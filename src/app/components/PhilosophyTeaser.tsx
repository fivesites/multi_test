import Link from "next/link";
import { client } from "../../../sanity/lib/client";
import { stickyNotesQuery } from "../../../sanity/lib/queries";
import { PhilosophyTicker } from "./PhilosophyTicker";
import { Button } from "@/components/ui/button";

export default async function PhilosophyTeaser() {
  const notes: { _id: string; text: string }[] =
    await client.fetch(stickyNotesQuery);

  return (
    <div className="relative">
      {/* Button floats over the ticker */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <Button variant="ghost" size="lg" asChild className="pointer-events-auto">
          <Link href="/philosophy">Read our philosophy</Link>
        </Button>
      </div>
      <PhilosophyTicker notes={notes} />
    </div>
  );
}
