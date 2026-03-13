"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { urlFor } from "../../../sanity/lib/image";

type Work = {
  _id: string;
  title: string;
  slug: { current: string };
  client?: string;
  year?: number;
  categories?: string[];
  backgroundColor?: string;
  coverImage?: { asset: { _ref: string }; hotspot?: object; crop?: object };
};

export function WorkGridClient({ works }: { works: Work[] }) {
  const [cols, setCols] = useState(
    [0, 1, 2].map((i) => Math.min(i, works.length - 1)),
  );

  if (!works.length) return null;

  const setCol = (col: number, idx: number) => {
    setCols((prev) => {
      const next = [...prev];
      next[col] = idx;
      return next;
    });
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 h-screen divide-border [&>*]:border-b [&>*]:border-border lg:[&>*]:border-b-0 divide-x">
      {cols.map((workIdx, col) => {
        const work = works[workIdx];
        return (
          <div key={col} className="flex flex-col overflow-hidden">
            {/* Select — normal flow so it's always clickable */}
            <div className="shrink-0 border-b border-border px-3 py-2 bg-background z-10">
              <Select
                value={String(workIdx)}
                onValueChange={(v) => setCol(col, Number(v))}
              >
                <SelectTrigger className="w-full border-0 shadow-none px-0 text-xs font-mono uppercase tracking-widest text-muted-foreground focus:ring-0 h-auto py-0.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {works.map((w, i) => (
                    <SelectItem
                      key={w._id}
                      value={String(i)}
                      className="text-xs font-mono uppercase tracking-widest"
                    >
                      {w.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Work card */}
            <Link
              href={`/work/${work.slug.current}`}
              className="relative flex-1 group block overflow-hidden"
              style={{
                backgroundColor: work.backgroundColor ?? "var(--secondary)",
              }}
            >
              {work.coverImage?.asset && (
                <Image
                  src={urlFor(work.coverImage).width(800).url()}
                  alt={work.title}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              )}

              {/* Hover info overlay */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-white font-absolution1 text-2xl leading-tight">
                  {work.title}
                </span>
                <div className="flex items-center gap-3 mt-1 text-white/60 text-xs font-mono">
                  {work.client && <span>{work.client}</span>}
                  {work.year && <span>{work.year}</span>}
                  {work.categories && work.categories.length > 0 && (
                    <span>{work.categories.join(" · ")}</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
