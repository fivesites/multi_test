"use client";

import M2Button from "./M2Button";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import { getCategoryLabel } from "@/lib/categories";

const TYPING_MS_PER_CHAR = 22;

const getFilterLabel = (cat: string) =>
  cat === "all" ? "All" : getCategoryLabel(cat);

/**
 * Mobile-only category picker. On desktop the filters live in the sticky left
 * column (CategoryFilters); below lg there is no room for it, so the same list
 * takes over the screen while `filtersOpen` is set.
 *
 * Sits below ViewToggles in the stack so its "Hide Filters" button stays
 * tappable over the overlay.
 */
export default function FilterOverlay() {
  const {
    filtersOpen,
    setFiltersOpen,
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
    setFiltersOpen(false);
  }

  return (
    <AnimatePresence>
      {filtersOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex lg:hidden fixed inset-0 z-40 w-full h-dvh bg-background px-3 "
        >
          <div className="flex flex-col items-baseline justify-center overflow-y-auto pointer-events-auto px-3  pb-6 gap-y-1.5 w-full ">
            {allCats.map((cat, i) => (
              <span
                key={cat}
                className="inline-flex items-baseline whitespace-nowrap w-full"
              >
                <M2Button
                  lg
                  text={getFilterLabel(cat)}
                  visible={filtersOpen}
                  delay={filterDelays[i]}
                  active={activeFilter === cat}
                  onClick={() => handleFilterChange(cat)}
                  className={cn(
                    " transition-colors duration-150 font-diatype uppercase font-bold text-xl px-0 leading-snug w-full border-b   ",
                    activeFilter === cat
                      ? "text-primary-foreground hover:text-primary-background border-primary-foreground hover:primary-background"
                      : "text-muted-foreground border-muted-foreground hover:border-muted-foreground hover:text-muted-background",
                  )}
                />
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
