"use client";

import { createContext, useContext, type ReactNode } from "react";

export type GridItem = {
  key: string;
  url: string;
  alt: string;
  slug: string;
  title: string;
  client?: string;
  credits?: unknown;
  categories: string[];
  aspectRatio: number;
  isPrimary: boolean;
  projectImages: { key: string; url: string; aspectRatio: number }[];
};

type WorkContextType = {
  items: GridItem[];
  categories: string[];
};

const WorkContext = createContext<WorkContextType>({ items: [], categories: [] });

export function WorkProvider({
  items,
  categories,
  children,
}: WorkContextType & { children: ReactNode }) {
  return (
    <WorkContext.Provider value={{ items, categories }}>
      {children}
    </WorkContext.Provider>
  );
}

export function useWork() {
  return useContext(WorkContext);
}
