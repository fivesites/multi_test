"use client";

import { cn } from "@/lib/utils";
import { useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import M2Button from "./M2Button";
import { Button } from "@/components/ui/button";
import CheckButton from "./CheckButton";
import SearchCheck from "./SearchCheck";
import { useState } from "react";

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

// Desktop grid zoom range — one wide column up to eight thumbnails per row.
const MIN_COLS = 1;
const MAX_COLS = 8;

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
    showSettings,
    setShowSettings,
    search,
    setSearch,
    searchOpen,
    setSearchOpen,
    showGrid,
    showList,
    setShowGrid,
    setShowList,
    numCols,
    setNumCols,
  } = useUI();
  const { categories } = useWork();

  // `showFilters` is the master switch for the whole control area; `showCat`
  // toggles just the category list within it.
  const [showFilters, setShowFilters] = useState(true);
  const [showCat, setShowCat] = useState(true);

  function showThumbnails() {
    setShowGrid(true);
    setShowList(false);
  }

  function showListView() {
    setShowList(true);
    setShowGrid(false);
  }

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
    <div
      className={cn(
        "hidden lg:block w-full col-start-1 col-span-12 ",
        className,
      )}
    >
      {/* The sidebar column on /projects — the parent decides where it sits.
          It scrolls with the list rather than sticking. */}
      <div className="grid grid-cols-12  gap-x-0 gap-y-12 items-baseline  w-full p-3">
        <CheckButton
          label={showFilters ? "hide filters" : "filter & settings"}
          size="label"
          active={showFilters}
          onClick={() => setShowFilters((v) => !v)}
          className="col-start-1 col-span-2 row-start-1"
        />
        {showFilters && (
          <>
            <CheckButton
              label="categories"
              size="label"
              active={showCat}
              className="col-start-3 row-start-1"
              onClick={() => setShowCat((v) => !v)}
            />
            <div className="relative col-start-9 col-span-1 row-start-1">
              <CheckButton
                label="settings"
                size="label"
                active={showSettings}
                onClick={() => setShowSettings(!showSettings)}
              />
            </div>
            <SearchCheck
              className="col-start-11 col-span-2 row-start-1"
              open={searchOpen}
              onToggle={() => setSearchOpen((v) => !v)}
              value={search}
              onChange={setSearch}
            />
          </>
        )}
        {showFilters && showCat && (
          <div className="col-start-3  col-span-6 row-start-2 grid grid-cols-6 px-0 gap-y-6">
            {allCats.map((cat, i) => (
              <span
                key={cat}
                className="inline-flex items-baseline whitespace-nowrap w-min col-span-2  "
              >
                <CheckButton
                  label={getFilterLabel(cat)}
                  size="label"
                  onClick={() => handleFilterChange(cat)}
                  active={activeFilter === cat}
                />
              </span>
            ))}
          </div>
        )}
        {showFilters && showSettings && (
          <div className="col-start-9 col-span-2 row-start-2 flex flex-col px-0 gap-6">
            <CheckButton
              label="list"
              size="label"
              active={showList}
              onClick={showListView}
            />
            <CheckButton
              label="thumbnails"
              size="label"
              active={showGrid}
              onClick={showThumbnails}
            />
            {showGrid && (
              <div className="flex flex-col gap-6 ">
                <CheckButton
                  label="Zoom In"
                  size="label"
                  onClick={() => setNumCols(Math.max(MIN_COLS, numCols - 1))}
                />
                <CheckButton
                  label="Zoom Out"
                  size="label"
                  onClick={() => setNumCols(Math.min(MAX_COLS, numCols + 1))}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
