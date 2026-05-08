"use client";

import { createContext, useContext, type ReactNode } from "react";

export type CopyEntry = {
  _id: string;
  key: string;
  title?: string;
  plainText?: string;
  body?: { _type: string; children?: { text?: string }[] }[];
};

type CopyContextType = {
  entries: Record<string, CopyEntry>;
};

const CopyContext = createContext<CopyContextType>({ entries: {} });

export function CopyProvider({
  entries,
  children,
}: CopyContextType & { children: ReactNode }) {
  return (
    <CopyContext.Provider value={{ entries }}>
      {children}
    </CopyContext.Provider>
  );
}

export function useCopy(key: string): string | null {
  const { entries } = useContext(CopyContext);
  const entry = entries[key];
  if (!entry) return null;
  if (entry.plainText) return entry.plainText;
  if (entry.body) {
    return entry.body
      .map((block) => (block.children ?? []).map((c) => c.text ?? "").join(""))
      .filter(Boolean)
      .join("\n\n");
  }
  return null;
}
