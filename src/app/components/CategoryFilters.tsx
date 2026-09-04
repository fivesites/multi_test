"use client";

import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import M2Button from "./M2Button";
import { Button } from "@/components/ui/button";
import CheckButton from "./CheckButton";
import SearchCheck from "./SearchCheck";
import { zoomInCols, zoomOutCols } from "@/lib/gridZoom";
import { useEffect, useState } from "react";

const DRAWER_EASE = [0.22, 1, 0.36, 1] as const;

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
  // toggles just the category list within it. Starts closed — matching the
  // mobile drawer's collapsed tab — then opens itself once on desktop, where
  // this is a static sidebar rather than a drawer someone has to pull out.
  // The breakpoint can't be known at render time (SSR has no viewport), so
  // this only runs after mount and only sets the initial default; it doesn't
  // fight a later manual close.
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setShowFilters(true);
    }
  }, []);
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
        // Mobile: a bottom-left drawer — a narrow tab holding just the "filters"
        // button until opened, sliding up to the full panel when it is. It's a
        // solid primary panel there, so everything inside it reads in
        // primary-foreground. Desktop drops all of that and becomes a static
        // sidebar column of the /projects grid.
        // left-3 always insets the tab from the screen edge; open, right-3 pairs
        // with it and the width goes auto so the panel spans between the two
        // insets rather than a full 100vw that would overflow past them.
        "fixed bottom-0 left-3 z-30 bg-primary max-lg:[&_*]:!text-primary-foreground pixelCornersTop",
        "transition-[width] duration-300 ease-out",
        showFilters ? "right-3 lg:grid lg:grid-cols-12 pb-3" : "w-1/3",
        "lg:static lg:inset-auto lg:z-auto lg:w-auto lg:bg-transparent lg:pb-0 lg:[mask-border:none] lg:[-webkit-mask-box-image:none] lg:col-start-1 lg:col-span-12",
        className,
      )}
    >
      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: DRAWER_EASE }}
            className="overflow-hidden lg:col-start-1 lg:col-span-12 lg:row-start-1"
          >
            <motion.div
              initial={{ y: 32 }}
              animate={{ y: 0 }}
              exit={{ y: 32 }}
              transition={{ duration: 0.4, ease: DRAWER_EASE }}
              className="grid grid-cols-3 lg:grid-cols-12 gap-x-0 gap-y-12 items-baseline w-full px-6 pt-6 pb-6 lg:p-3"
            >
              <CheckButton
                label="categories"
                size="label"
                active={showCat}
                className="col-start-1 row-start-2 lg:col-start-3 lg:row-start-1"
                onClick={() => setShowCat((v) => !v)}
              />
              <div className="relative col-start-3 row-start-2 lg:col-start-9 col-span-1 lg:row-start-1">
                <CheckButton
                  label="settings"
                  size="label"
                  active={showSettings}
                  onClick={() => setShowSettings(!showSettings)}
                />
              </div>
              <SearchCheck
                // Mobile: row 4 drops it below whichever sub-menu is open (both
                // sit on row 3); -mt-6 trims the grid's 12 row gap back to 6 so
                // it keeps the sub-menu's own 6 rhythm.
                className="col-start-3 row-start-4 max-lg:-mt-6 lg:col-start-11 lg:col-span-2 lg:row-start-1"
                open={searchOpen}
                onToggle={() => setSearchOpen((v) => !v)}
                value={search}
                onChange={setSearch}
              />
              {showCat && (
                <div className="col-start-1 row-start-3 lg:col-start-3 col-span-3 lg:col-span-6 lg:row-start-2 grid grid-cols-3 lg:grid-cols-6 px-0 gap-y-6">
                  {allCats.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-baseline whitespace-nowrap w-min col-span-2"
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
              {showSettings && (
                <div className="col-start-3 row-start-3 lg:col-start-9 col-span-2 lg:row-start-2 flex flex-col px-0 gap-6">
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
                    <div className="flex flex-col gap-6">
                      <CheckButton
                        label="Zoom In"
                        size="label"
                        onClick={() => setNumCols(zoomInCols(numCols))}
                      />
                      <CheckButton
                        label="Zoom Out"
                        size="label"
                        onClick={() => setNumCols(zoomOutCols(numCols))}
                      />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: the toggle sits at the drawer's bottom edge so it holds its
          position whether the panel is open or closed. Desktop: it drops into
          the panel grid's empty left columns, bottom-aligned (lg:self-end) with
          matching lg:p-3 so its baseline lands on the last sub-menu row. */}
      <div className="px-6 py-4 lg:px-3 lg:py-0 lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:self-end lg:z-10">
        <CheckButton
          label={showFilters ? "close" : "show filters"}
          size="label"
          active
          onClick={() => setShowFilters((v) => !v)}
        />
      </div>
    </div>
  );
}
