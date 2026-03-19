"use client";

import { useState, useEffect, useCallback } from "react";
import type { SavedAsset } from "@/app/lib/multiUtils";

function fromApi(raw: Record<string, unknown>): SavedAsset {
  let cells: boolean[][] = [];
  try {
    cells = raw.cells ? JSON.parse(raw.cells as string) : [];
  } catch {
    console.warn("useSavedAssets: failed to parse cells for", raw._id);
  }
  return {
    id:                raw._id as string,
    label:             raw.label as string,
    role:              (raw.role as string) ?? undefined,
    type:              raw.type as SavedAsset["type"],
    cells,
    glyphStyle:        (raw.glyphStyle as SavedAsset["glyphStyle"]) ?? "square",
    noGap:             (raw.noGap as boolean) ?? true,
    cols:              (raw.cols as number) ?? 15,
    rows:              (raw.rows as number) ?? 15,
    uploadedAsset:     (raw.uploadedAsset as string)      ?? undefined,
    colorA:            (raw.colorA as string)             ?? undefined,
    colorB:            (raw.colorB as string)             ?? undefined,
    checkerStripCount: (raw.checkerStripCount as number)  ?? undefined,
  };
}

export function useSavedAssets() {
  const [saved, setSaved] = useState<SavedAsset[]>([]);

  useEffect(() => {
    fetch("/api/multi-assets")
      .then((r) => r.json())
      .then((data: Record<string, unknown>[]) => setSaved(data.map(fromApi)))
      .catch((err) => console.error("useSavedAssets: fetch failed", err));
  }, []);

  const save = useCallback(async (entry: Omit<SavedAsset, "id">) => {
    let id = `local-${Date.now()}`;
    try {
      const res = await fetch("/api/multi-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.id) id = json.id;
      }
    } catch {}
    setSaved((prev) => [...prev, { ...entry, id }]);
  }, []);

  const rename = useCallback(async (id: string, label: string) => {
    try {
      await fetch(`/api/multi-assets?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });
    } catch {}
    setSaved((prev) => prev.map((a) => (a.id === id ? { ...a, label } : a)));
  }, []);

  const setRole = useCallback(async (id: string, role: string) => {
    try {
      await fetch(`/api/multi-assets?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
    } catch {}
    setSaved((prev) => prev.map((a) => (a.id === id ? { ...a, role } : a)));
  }, []);

  const remove = useCallback(async (id: string) => {
    await fetch(`/api/multi-assets?id=${id}`, { method: "DELETE" });
    setSaved((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { saved, save, rename, setRole, remove };
}
