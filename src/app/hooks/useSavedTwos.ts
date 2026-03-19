"use client";

import { useState, useEffect, useCallback } from "react";
import type { SavedTwo } from "@/app/lib/twoUtils";

const LS_KEY = "multi2_saved_twos";

function fromApi(raw: Record<string, unknown>): SavedTwo {
  return {
    id: raw._id as string,
    label: raw.label as string,
    cells: JSON.parse(raw.cells as string) as boolean[][],
    style: raw.style as SavedTwo["style"],
    noGap: (raw.noGap as boolean) ?? false,
    cols: raw.cols as number,
    rows: raw.rows as number,
    asset: (raw.asset as string) ?? undefined,
  };
}

export function useSavedTwos() {
  const [saved, setSaved] = useState<SavedTwo[]>(() => {
    // Seed from localStorage for instant render
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Fetch from Sanity on mount and keep in sync
  useEffect(() => {
    fetch("/api/two-designs")
      .then((r) => r.json())
      .then((data: Record<string, unknown>[]) => {
        const designs = data.map(fromApi);
        setSaved(designs);
        localStorage.setItem(LS_KEY, JSON.stringify(designs));
      })
      .catch(() => {});
  }, []);

  const save = useCallback(async (entry: Omit<SavedTwo, "id">) => {
    const res = await fetch("/api/two-designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    const { id } = await res.json();
    const newDesign: SavedTwo = { ...entry, id };
    setSaved((prev) => {
      const next = [...prev, newDesign];
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback(async (id: string) => {
    await fetch(`/api/two-designs?id=${id}`, { method: "DELETE" });
    setSaved((prev) => {
      const next = prev.filter((t) => t.id !== id);
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { saved, save, remove };
}
