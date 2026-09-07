"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import CheckButton from "./CheckButton";
import { useWork } from "@/context/WorkContext";

/**
 * The bottom-of-page project pager: previous project, back to the archive, next
 * project — each a CheckButton. Prev/next walk the primary works in archive
 * order and wrap around at the ends. Reads the current slug off the path, so it
 * needs no props.
 */
export default function ProjectsNav() {
  const { items } = useWork();
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).pop() ?? "";

  const { prev, next } = useMemo(() => {
    const seen = new Set<string>();
    const list = items.filter((i) => {
      if (!i.isPrimary || seen.has(i.slug)) return false;
      seen.add(i.slug);
      return true;
    });
    const idx = list.findIndex((i) => i.slug === slug);
    if (idx === -1 || list.length < 2) return { prev: null, next: null };
    return {
      prev: list[(idx - 1 + list.length) % list.length],
      next: list[(idx + 1) % list.length],
    };
  }, [items, slug]);

  return (
    <nav className="grid grid-cols-3 lg:grid-cols-12 w-full items-baseline gap-y-6 px-3 lg:px-0 ">
      <CheckButton
        href="/projects"
        label="all projects"
        size="lg"
        marks={{ active: "↖", inactive: "↖" }}
        className="col-start-1 col-span-1 lg:col-start-4 lg:col-span-2 justify-center  "
      />
      {prev && (
        <CheckButton
          href={`/projects/${prev.slug}`}
          label="previous"
          size="lg"
          marks={{ active: "←", inactive: "←" }}
          className="col-start-2 col-span-1 lg:col-start-8 lg:col-span-2 "
        />
      )}

      {next && (
        <CheckButton
          href={`/projects/${next.slug}`}
          label="next"
          size="label"
          labelSide="left"
          marks={{ active: "→", inactive: "→" }}
          className="col-start-3 col-span-1  lg:col-start-12 lg:col-span-2 justify-end w-min "
        />
      )}
    </nav>
  );
}
