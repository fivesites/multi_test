import React from "react";
import { sanityFetch } from "../../sanity/lib/client";
import { allCopyQuery } from "../../sanity/lib/queries";
import { CopyProvider, type CopyEntry } from "./CopyContext";

export async function CopyContextServer({
  children,
}: {
  children: React.ReactNode;
}) {
  let copyEntries: CopyEntry[] = [];
  try {
    copyEntries = await sanityFetch<CopyEntry[]>(allCopyQuery);
  } catch (error) {
    // Sanity unreachable — render with no copy overrides rather than crashing.
    console.error("CopyContextServer: Sanity fetch failed", error);
  }

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
