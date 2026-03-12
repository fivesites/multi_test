import { client } from "../../../sanity/lib/client";
import { stickyNotesQuery } from "../../../sanity/lib/queries";

export const revalidate = 60;

const COLS_LG = 4;

export default async function PhilosophyPage() {
  const notes: { _id: string; text: string }[] =
    await client.fetch(stickyNotesQuery);

  // Pad to fill the last row (based on lg cols)
  const total = Math.ceil(Math.max(notes.length, COLS_LG) / COLS_LG) * COLS_LG;
  const cells = [...notes, ...Array(total - notes.length).fill(null)] as ({
    _id: string;
    text: string;
  } | null)[];

  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {cells.map((note, i) => (
          <div
            key={note?._id ?? i}
            className="philosophy-cell aspect-square flex items-center justify-center p-12"
          >
            {note && (
              <p className="text-center text-sm lg:text-base font-mono leading-tight">
                {note.text}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
