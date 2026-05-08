import React from "react";
import { client } from "../../sanity/lib/client";
import { allCopyQuery, stickyNotesQuery } from "../../sanity/lib/queries";
import { CopyProvider, type CopyEntry } from "./CopyContext";
import GlobalLoader from "@/app/components/GlobalLoader";

export async function CopyContextServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [copyEntries, notes] = await Promise.all([
    client.fetch<CopyEntry[]>(allCopyQuery),
    client.fetch<{ _id: string; text: string }[]>(stickyNotesQuery),
  ]);

  const tagline =
    notes.length > 0
      ? notes[Math.floor(Math.random() * notes.length)].text
      : "Small team. Big multiplier.";

  const copyMap: Record<string, CopyEntry> = {};
  for (const entry of copyEntries) {
    copyMap[entry.key] = entry;
  }

  return (
    <CopyProvider entries={copyMap}>
      <GlobalLoader tagline={tagline} />
      {children}
    </CopyProvider>
  );
}
