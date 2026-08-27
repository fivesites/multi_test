"use client";

import { cn } from "@/lib/utils";
import { useUI } from "@/context/UIContext";
import M2Button from "./M2Button";
import { getActiveFilterLabel } from "@/lib/categories";
import { Button } from "@/components/ui/button";

const BUTTON_CLASS = "btnText";

// Desktop grid zoom range — one wide column up to eight thumbnails per row.
const MIN_COLS = 1;
const MAX_COLS = 8;

const viewClass = (active: boolean) =>
  cn(
    BUTTON_CLASS,
    active ? "text-primary-foreground" : "text-muted-foreground",
    "transition-colors duration-150",
  );

/**
 * Thumbnails / List pair on its own — the desktop header puts it in the
 * grid's 4th column, the mobile bar puts it next to the filter toggle.
 */
export function ViewToggleButtons({ className = "" }: { className?: string }) {
  const { showGrid, setShowList, setShowGrid, numCols, setNumCols } = useUI();

  function showThumbnails() {
    setShowGrid(true);
    setShowList(false);
  }

  function showListView() {
    setShowList(true);
    setShowGrid(false);
  }

  const separator = (
    <Button
      variant="ghost"
      className="h-auto bg-transparent hover:bg-transparent hover:text-foreground cursor-none"
      aria-hidden
      tabIndex={-1}
    >
      /
    </Button>
  );

  return (
    <span
      className={cn("flex items-end h-min justify-between gap-x-3", className)}
    >
      {/* Zoom only steps the desktop grid, so it stays out of the mobile bar
          and hides whenever the list is the active view. */}
      {showGrid && (
        <span className="hidden items-end gap-x-3 lg:flex">
          <Button
            variant="ghost"
            size="xs"
            className="h-auto"
            onClick={() => setNumCols(Math.max(MIN_COLS, numCols - 1))}
            disabled={numCols <= MIN_COLS}
          >
            Zoom In
          </Button>

          <Button
            variant="ghost"
            size="xs"
            className="h-auto"
            onClick={() => setNumCols(Math.min(MAX_COLS, numCols + 1))}
            disabled={numCols >= MAX_COLS}
          >
            Zoom Out
          </Button>
        </span>
      )}
      <Button
        variant="ghost"
        size="xs"
        className="h-auto"
        onClick={showThumbnails}
      >
        Thumbnails
      </Button>

      <Button
        variant="ghost"
        size="xs"
        className="h-auto"
        onClick={showListView}
      >
        List
      </Button>
    </span>
  );
}

/**
 * Mobile bar: the projects heading on the left, view toggles on the right.
 * Scrolls away with the section it heads.
 *
 * There is no room for a separate filter toggle below lg, so the heading is the
 * toggle — it names the active filter and opens the category overlay. Desktop
 * keeps the two apart: the category column is always on screen there, and the
 * heading belongs to the projects grid's own header row.
 */
export default function ViewToggles({
  className = "",
}: {
  className?: string;
}) {
  const { filtersOpen, setFiltersOpen, activeFilter } = useUI();

  return (
    <div
      className={cn(
        "flex items-end justify-between",
        // Ties with FilterOverlay's z-40 and comes later in the DOM, so the
        // heading — which is the overlay's only close button — stays tappable
        // above it.
        "relative z-40",
        className,
      )}
    >
      <h2 className="flex items-baseline gap-x-3">
        <span className={cn(BUTTON_CLASS, "text-muted-foreground")}>
          Projects:
        </span>
        <M2Button
          text={getActiveFilterLabel(activeFilter)}
          visible
          delay={0}
          active={filtersOpen}
          onClick={() => setFiltersOpen((v) => !v)}
          className={viewClass(filtersOpen)}
        />
      </h2>
      <ViewToggleButtons />
    </div>
  );
}
