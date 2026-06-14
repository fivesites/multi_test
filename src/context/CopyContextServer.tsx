import React from "react";
import { client } from "../../sanity/lib/client";
import { allCopyQuery } from "../../sanity/lib/queries";
import { CopyProvider, type CopyEntry } from "./CopyContext";

export async function CopyContextServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const copyEntries = await client.fetch<CopyEntry[]>(allCopyQuery);

  const copyMap: Record<string, CopyEntry> = {};
  for (const entry of copyEntries) {
    copyMap[entry.key] = entry;
  }

  return (
    <CopyProvider entries={copyMap}>
      {children}
    </CopyProvider>
  );
}
