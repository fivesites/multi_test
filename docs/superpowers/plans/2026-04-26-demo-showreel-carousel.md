# Demo Showreel Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the boolean `showProjects` toggle in DemoClient with a mutually-exclusive `view` state, wire the Showreel button to its own view, and render a horizontal image carousel (first 3 primary images) below the category buttons when showreel is active.

**Architecture:** All changes are confined to `src/app/demo/DemoClient.tsx`. A `view: null | "showreel" | "projects"` state replaces `showProjects`. The existing `ImageCarousel` component is reused with no modifications — it already accepts the shape we need.

**Tech Stack:** Next.js App Router, React, TailwindCSS, Framer Motion, Embla Carousel (via `ImageCarousel`)

---

## File Map

| File | Action |
|------|--------|
| `src/app/demo/DemoClient.tsx` | Modify — all changes live here |
| `src/app/demo/ImageCarousel.tsx` | Read-only — reused as-is |

---

### Task 1: Replace state and fix button handlers

**Files:**
- Modify: `src/app/demo/DemoClient.tsx`

- [ ] **Step 1: Replace `showProjects` state with `view`, add `toggleView` helper, update imports**

  Replace lines 1–56 (the entire section before the `return`) with the following. The key changes are:
  - `useState<null | "showreel" | "projects">(null)` replaces `useState(false)` for `showProjects`
  - Add `toggleView` helper
  - Add `ImageCarousel` import

  ```tsx
  "use client";

  import { useState } from "react";
  import Image from "next/image";
  import { motion, AnimatePresence } from "motion/react";
  import MultiCard from "./MultiCard";
  import ImageCarousel from "./ImageCarousel";
  import { Button } from "@/components/ui/button";
  import { cn } from "@/lib/utils";
  import { X } from "lucide-react";

  const CATEGORY_LABELS: Record<string, string> = {
    photo: "Photo",
    video: "Video",
    production: "Production",
    "art-direction": "Art Direction",
    concept: "Concept",
    "sound-design": "Sound Design",
    vax: "Vax",
    dop: "DOP",
    "post-processing": "Post-processing",
  };

  export type GridItem = {
    key: string;
    url: string;
    alt: string;
    slug: string;
    title: string;
    client?: string;
    categories: string[];
    aspectRatio: number;
    isPrimary: boolean;
    projectImages: { key: string; url: string; aspectRatio: number }[];
  };

  export default function DemoClient({
    items,
    categories,
  }: {
    items: GridItem[];
    categories: string[];
  }) {
    const [view, setView] = useState<null | "showreel" | "projects">(null);
    const [active, setActive] = useState("all");
    const [openSlug, setOpenSlug] = useState<string | null>(null);
    const [showAbout, setShowAbout] = useState(true);

    function toggleView(v: "showreel" | "projects") {
      setView((current) => (current === v ? null : v));
    }

    const displayed =
      active === "all"
        ? items.filter((i) => i.isPrimary)
        : items.filter((i) => i.categories.includes(active));

    const showreelImages = items
      .filter((i) => i.isPrimary)
      .slice(0, 3)
      .map((i) => ({ key: i.key, url: i.url, aspectRatio: i.aspectRatio }));

    function handleFilterChange(cat: string) {
      setActive(cat);
      setOpenSlug(null);
    }
  ```

- [ ] **Step 2: Update the top nav row JSX**

  Replace only the inner top nav `<div>` (the `flex flex-row justify-between` block — do NOT touch the outer `return (` or `<div className="min-h-screen">` wrapping it):

  ```tsx
        <div className="flex flex-row justify-between w-full lg:justify-start lg:gap-x-16 font-rounded text-2xl text-red-200 px-2 pt-1 items-baseline">
          <Button
            variant={showAbout ? "glow" : "link"}
            className={cn(
              "font-rounded text-2xl tracking-wider gap-0 transition-colors",
              !showAbout &&
                "text-red-200 hover:text-red-500 no-underline hover:no-underline",
            )}
            onClick={() => setShowAbout(!showAbout)}
          >
            Multi <span className="font-ft88-gothique text-base ml-0">2</span>
          </Button>
          <div className="flex items-baseline">
            <Button
              variant={view === "showreel" ? "glow" : "link"}
              className={cn(
                "font-rounded transition-colors",
                view !== "showreel" &&
                  "text-red-200 hover:text-red-500 no-underline hover:no-underline",
              )}
              onClick={() => toggleView("showreel")}
            >
              Showreel
            </Button>
            ,
            <Button
              variant={view === "projects" ? "glow" : "link"}
              className={cn(
                "font-rounded transition-colors ml-1",
                view !== "projects" &&
                  "text-red-200 hover:text-red-500 no-underline hover:no-underline",
              )}
              onClick={() => toggleView("projects")}
            >
              Projects
            </Button>
            ,
            <Button
              variant="link"
              className="ml-1 text-red-200 hover:text-red-500 no-underline hover:no-underline"
            >
              Connect
            </Button>
          </div>
        </div>
  ```

  The `{showShowReel && <div> </div>}` line that was between the top nav and the about panel is simply omitted — do not carry it forward. Leave the about panel JSX (`{!showAbout && (...)}`) in place unchanged.

- [ ] **Step 3: Verify in browser**

  Run: `npm run dev`

  - Open `/demo`
  - Click Showreel — button should glow, Projects should be un-glowed
  - Click Projects — button should glow, Showreel should un-glow
  - Click the active button again — both should be un-glowed (collapsed to null)
  - No console errors about `showShowReel`

- [ ] **Step 4: Commit**

  ```bash
  git add src/app/demo/DemoClient.tsx
  git commit -m "feat: replace showProjects bool with view state, wire showreel/projects buttons"
  ```

---

### Task 2: Category buttons always visible, only interactive in projects view

**Files:**
- Modify: `src/app/demo/DemoClient.tsx`

- [ ] **Step 1: Update the category filter block**

  Replace the existing category `<div>` (the `px-2 text-2xl font-rounded` block) with:

  ```tsx
        <div className="px-2 text-2xl font-rounded text-red-200 leading-none">
          {["all", ...categories].map((cat, i) => (
            <span key={cat}>
              <Button
                variant={view === "projects" && active === cat ? "glow" : "link"}
                onClick={view === "projects" ? () => handleFilterChange(cat) : undefined}
                className={cn(
                  "font-rounded transition-colors inline px-0",
                  (view !== "projects" || active !== cat) &&
                    "text-red-200 hover:text-red-500 no-underline hover:no-underline",
                  view !== "projects" && "pointer-events-none opacity-50",
                )}
              >
                {cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
              </Button>
              {i !== categories.length && ","}{" "}
            </span>
          ))}
        </div>
  ```

- [ ] **Step 2: Verify in browser**

  - With no view active: category buttons visible but muted (50% opacity, not clickable)
  - With Showreel active: same muted appearance
  - With Projects active: category buttons fully interactive, active one glows

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/demo/DemoClient.tsx
  git commit -m "feat: category buttons always visible, interactive only in projects view"
  ```

---

### Task 3: Render showreel carousel below categories

**Files:**
- Modify: `src/app/demo/DemoClient.tsx`

- [ ] **Step 1: Add carousel block and update projects conditional**

  After the category `</div>`, add the showreel carousel block. Also update the projects grid conditional from `showProjects` to `view === "projects"`. The final closing section of the component should look like:

  ```tsx
        {view === "showreel" && (
          <div className="px-2 pt-2">
            <ImageCarousel
              images={showreelImages}
              onImageClick={() => {}}
            />
          </div>
        )}

        {view === "projects" && (
          <>
            {/* Masonry grid — CSS columns */}
            <div className="columns-2 md:columns-3 gap-2 px-2 pt-1">
              <AnimatePresence mode="popLayout" initial={false}>
                {displayed.map((item) => {
                  const isOpen = item.slug === openSlug;

                  if (isOpen) {
                    return (
                      <motion.div
                        key={`card-${item.slug}`}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ columnSpan: "all" } as React.CSSProperties}
                        className="mb-2"
                      >
                        <MultiCard
                          title={item.title}
                          client={item.client}
                          categories={item.categories}
                          slug={item.slug}
                          projectImages={item.projectImages}
                          thumbKey={`thumb-${item.key}`}
                          onClose={() => setOpenSlug(null)}
                        />
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative break-inside-avoid mb-2 cursor-pointer group"
                      style={{
                        paddingBottom: `${(1 / item.aspectRatio) * 100}%`,
                      }}
                      onClick={() => setOpenSlug(item.slug)}
                    >
                      <motion.div
                        layoutId={`thumb-${item.key}`}
                        className="absolute inset-0"
                      >
                        <Image
                          src={item.url}
                          alt={item.alt}
                          fill
                          className="object-cover transition-opacity duration-300 group-hover:opacity-70"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify in browser**

  - Click Showreel — horizontal carousel appears below category buttons showing 3 images; prev/next arrows work
  - Click Projects — carousel disappears, masonry grid appears
  - Toggle between the two — no layout glitches or console errors
  - Category filter works in Projects view

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/demo/DemoClient.tsx
  git commit -m "feat: add showreel carousel below category buttons in demo page"
  ```
