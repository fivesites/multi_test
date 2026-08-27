"use client";

import { cn } from "@/lib/utils";
import { useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import M2Button from "./M2Button";
import { Button } from "@/components/ui/button";

const CATEGORY_LABELS: Record<string, string> = {
  photo: "Photo",
  video: "Video",
  production: "Production",
  "art-direction": "Art Direction",
  concept: "Concept",
  "sound-design": "Sound Design",
  vax: "Vax",
  dop: "DOP",
  "post-processing": "Post-Processing",
  "post-production": "Post Production",
  music: "Music Production",
  "music-production": "Music Production",
};

const TYPING_MS_PER_CHAR = 22;

// Same label + delay math as lib/navTiming, which times the project list reveal.
const getFilterLabel = (cat: string) =>
  cat === "all" ? "All Projects" : (CATEGORY_LABELS[cat] ?? cat);

export default function CategoryFilters({
  className = "",
}: {
  className?: string;
}) {
  const {
    activeFilter,
    setActiveFilter,
    setOpenedCard,
    setShowSettings,
    setSearch,
  } = useUI();
  const { categories } = useWork();

  // the CMS can hold two slugs that render the same label (art-direction /
  // Art Direction), so dedupe on what the visitor actually sees
  const seenLabels = new Set<string>();
  const allCats = ["all", ...categories].filter((cat) => {
    const key = getFilterLabel(cat).trim().toLowerCase();
    if (seenLabels.has(key)) return false;
    seenLabels.add(key);
    return true;
  });
  const filterDelays = allCats.reduce<number[]>((acc, _cat, i) => {
    if (i === 0) return [0];
    const prevLabel = getFilterLabel(allCats[i - 1]);
    return [...acc, acc[i - 1] + (prevLabel.length + 2) * TYPING_MS_PER_CHAR];
  }, []);

  function handleFilterChange(cat: string) {
    setActiveFilter(cat);
    setOpenedCard(null);
    setSearch("");
    setShowSettings(false);
  }

  return (
    <div className={cn("hidden lg:block w-full", className)}>
      {/* The sidebar column on /projects — the parent decides where it sits.
          It scrolls with the list rather than sticking. */}
      <div className="flex flex-col items-baseline gap-y-0 w-full">
        {allCats.map((cat, i) => (
          <span
            key={cat}
            className="inline-flex items-baseline whitespace-nowrap w-min "
          >
            <Button
              variant="link"
              size="filter"
              onClick={() => handleFilterChange(cat)}
              className={cn(
                "transition-all h-min text-left duration-150    w-full uppercase  font-medium text-sm tracking-wide justify-start",
                activeFilter === cat
                  ? "text-primary hover:text-primary px-1.5"
                  : "text-foreground px-0 hover:px-1.5 hover:text-primary",
              )}
            >
              {getFilterLabel(cat)}
            </Button>
          </span>
        ))}
      </div>
    </div>
  );
}
