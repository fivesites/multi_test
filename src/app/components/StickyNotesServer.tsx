import { client } from "../../../sanity/lib/client";
import { stickyNotesQuery } from "../../../sanity/lib/queries";
import StickyNotes from "./StickyNotes";

export default async function StickyNotesServer() {
  const data: { _id: string; text: string }[] = await client.fetch(
    stickyNotesQuery,
  );
  const notes = data.map((n) => n.text);
  return <StickyNotes notes={notes} />;
}
