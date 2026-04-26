# Demo Pixelated Grid + Showreel Slideshow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all project grid thumbnails render pixelated until a card is opened, and replace the showreel carousel with a single-image auto-crossfade slideshow where each incoming image de-pixelates as it settles.

**Architecture:** Two-layer image stack (tiny 16px image with `image-rendering: pixelated` on top, full-res beneath) drives the pixelated look in both features. In the grid, the pixelated overlay is permanent for closed cards; in the showreel, it fades from 1→0 on each incoming slide simultaneously with the container fading in. MultiCard's carousel is replaced by a 2-column CSS masonry grid.

**Tech Stack:** Next.js 15 (App Router), React, Framer Motion (`motion/react`), TailwindCSS, `next/image`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/app/demo/ShowreelSlideshow.tsx` | Create | Single-image auto-crossfade slideshow with de-pixelation |
| `src/app/demo/DemoClient.tsx` | Modify | Pixelated grid thumbnails + scroll-to-top on card open + use ShowreelSlideshow |
| `src/app/demo/MultiCard.tsx` | Modify | Replace ImageCarousel with 2-column masonry grid; remove `thumbKey` prop |
| `src/app/demo/ImageCarousel.tsx` | Delete | No longer used after Tasks 2 and 5 |

---

## Task 1: Create ShowreelSlideshow component

**Files:**
- Create: `src/app/demo/ShowreelSlideshow.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

type SlideImage = { key: string; url: string; aspectRatio: number };

export default function ShowreelSlideshow({ images }: { images: SlideImage[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  const current = images[index];
  if (!current) return null;

  const containerAspectRatio = images[0]?.aspectRatio ?? 16 / 9;
  const tinyW = 16;
  const tinyH = Math.round(16 / current.aspectRatio);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ paddingBottom: `${(1 / containerAspectRatio) * 100}%` }}
    >
      <AnimatePresence>
        <motion.div
          key={current.key}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Full-res layer */}
          <Image
            src={current.url}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 85vw"
          />
          {/* Pixelated overlay — fades out as slide settles */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={current.url}
              alt=""
              width={tinyW}
              height={tinyH}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ imageRendering: "pixelated" }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Verify the file builds without errors**

Run: `cd /Users/joeljarvi/squared && npx tsc --noEmit`
Expected: No errors related to `ShowreelSlideshow.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/app/demo/ShowreelSlideshow.tsx
git commit -m "feat: add ShowreelSlideshow with pixelated-to-clear crossfade"
```

---

## Task 2: Wire ShowreelSlideshow into DemoClient

Replace the `ImageCarousel` usage in the showreel section of `DemoClient.tsx` with the new `ShowreelSlideshow`.

**Files:**
- Modify: `src/app/demo/DemoClient.tsx`

- [ ] **Step 1: Replace the import and component in the showreel section**

In `DemoClient.tsx`:

1. Remove: `import ImageCarousel from "./ImageCarousel";`
2. Add: `import ShowreelSlideshow from "./ShowreelSlideshow";`

3. Replace the showreel block (currently around line 155–159):

```tsx
{view === "showreel" && (
  <div className="px-2 pt-2">
    <ShowreelSlideshow images={showreelImages} />
  </div>
)}
```

- [ ] **Step 2: Start the dev server and verify the showreel**

Run: `npm run dev`

Navigate to the demo page, click "Showreel". Verify:
- One image fills the full width
- After 3 seconds the next image crossfades in
- The incoming image briefly appears pixelated then sharpens to clear
- The outgoing image fades out simultaneously
- It loops back to the first image after the last

- [ ] **Step 3: Commit**

```bash
git add src/app/demo/DemoClient.tsx
git commit -m "feat: replace showreel ImageCarousel with ShowreelSlideshow"
```

---

## Task 3: Add pixelated thumbnails to grid cards

Every closed-state grid card should show a pixelated (tiny, upscaled) image with square pixels. The full-res image pre-loads underneath for instant reveal.

**Files:**
- Modify: `src/app/demo/DemoClient.tsx`

- [ ] **Step 1: Replace the closed-card image block**

Find the closed-card `return` block in `DemoClient.tsx` (the `motion.div` with `key={item.key}`). Replace the inner image block:

Before (roughly lines 207–218):
```tsx
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
```

After:
```tsx
<div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-70">
  {/* Full-res — pre-loads for instant reveal when card opens */}
  <Image
    src={item.url}
    alt={item.alt}
    fill
    className="object-cover"
    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  />
  {/* Pixelated overlay — tiny image scaled up with square pixels */}
  <Image
    src={item.url}
    alt=""
    width={16}
    height={Math.round(16 / item.aspectRatio)}
    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
    style={{ imageRendering: "pixelated" }}
    aria-hidden
  />
</div>
```

- [ ] **Step 2: Verify in the browser**

Navigate to Projects view. Verify:
- All thumbnails render as large blocky pixels (not blurry — sharp square pixels)
- Hovering a card dims the whole pixelated image (not just the full-res layer)
- Pixel cells are square (not stretched into rectangles) on both portrait and landscape thumbnails

- [ ] **Step 3: Commit**

```bash
git add src/app/demo/DemoClient.tsx
git commit -m "feat: add pixelated two-layer thumbnails to project grid cards"
```

---

## Task 4: Snap opened card to top of viewport

When a card opens, scroll the page so the card is at the top of the viewport.

**Files:**
- Modify: `src/app/demo/DemoClient.tsx`

- [ ] **Step 1: Add the ref and scroll effect**

At the top of the `DemoClient` function, add after the existing `useState` calls:

```tsx
const openCardRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (openSlug && openCardRef.current) {
    openCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}, [openSlug]);
```

Add `useRef` and `useEffect` to the React import at the top of the file:
```tsx
import { useState, useRef, useEffect } from "react";
```

- [ ] **Step 2: Attach the ref to the opened card**

In the `isOpen` branch of the `.map()` (the `motion.div` with `key={`card-${item.slug}`}`), add `ref={openCardRef}`:

```tsx
<motion.div
  ref={openCardRef}
  key={`card-${item.slug}`}
  layout
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
  style={{ columnSpan: "all" } as React.CSSProperties}
  className="mb-2"
>
```

- [ ] **Step 3: Verify in the browser**

Click any card while scrolled down the page. Verify:
- The page smoothly scrolls so the opened card appears at the top of the viewport
- Closing the card does not trigger a scroll

- [ ] **Step 4: Commit**

```bash
git add src/app/demo/DemoClient.tsx
git commit -m "feat: scroll opened card to top of viewport on open"
```

---

## Task 5: Replace ImageCarousel with masonry grid in MultiCard

Remove the `ImageCarousel` and `thumbKey` prop from `MultiCard`, replacing with a 2-column CSS masonry grid. Update the call site in `DemoClient`.

**Files:**
- Modify: `src/app/demo/MultiCard.tsx`
- Modify: `src/app/demo/DemoClient.tsx`

- [ ] **Step 1: Rewrite MultiCard**

Replace the entire contents of `src/app/demo/MultiCard.tsx` with:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Lightbox from "./Lightbox";

type ProjectImage = { key: string; url: string; aspectRatio: number };

export default function MultiCard({
  title,
  client,
  categories,
  slug,
  projectImages,
  onClose,
}: {
  title: string;
  client?: string;
  categories: string[];
  slug: string;
  projectImages: ProjectImage[];
  onClose: () => void;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <Card className="w-full text-red-600">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-0">
          <div className="flex flex-col gap-0">
            <p className="text-2xl font-rounded leading-tight">
              {client ?? title}, 2024
            </p>
          </div>
          <div className="flex items-center gap-0 shrink-0">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/work/${slug}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close"
              onClick={onClose}
              className="text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-2xl leading-tight font-rounded max-w-3xl mb-2">
            Multi² is not your typical company. It's a multiplier. This is the
            story of Adam and Daniel who found each other through a shared
            multidisciplinary mindset. Together, they don't just double the
            output — they multiply it, exponentially. From global brands like
            IKEA to bold collaborations with Jureskog and ATG, we help brands
            move faster, think clearer, and create more with less.
          </p>

          <div className="columns-2 gap-2">
            {projectImages.map((img, i) => (
              <div
                key={img.key}
                className="relative break-inside-avoid mb-2 cursor-zoom-in"
                style={{ paddingBottom: `${(1 / img.aspectRatio) * 100}%` }}
                onClick={() => setLightboxIndex(i)}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={projectImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Update the MultiCard call site in DemoClient**

In `DemoClient.tsx`, remove the `thumbKey` prop from the `<MultiCard>` usage:

```tsx
<MultiCard
  title={item.title}
  client={item.client}
  categories={item.categories}
  slug={item.slug}
  projectImages={item.projectImages}
  onClose={() => setOpenSlug(null)}
/>
```

- [ ] **Step 3: Run a type check**

Run: `npx tsc --noEmit`
Expected: No errors. (TypeScript will complain if `thumbKey` is still passed somewhere.)

- [ ] **Step 4: Verify in the browser**

Click a card to open it. Verify:
- The opened card shows a 2-column masonry grid of images (not a horizontal carousel)
- Images are full-resolution and clear (not pixelated)
- Clicking any image opens the Lightbox
- The close button works

- [ ] **Step 5: Commit**

```bash
git add src/app/demo/MultiCard.tsx src/app/demo/DemoClient.tsx
git commit -m "feat: replace MultiCard carousel with 2-column masonry grid"
```

---

## Task 6: Delete ImageCarousel

`ImageCarousel` is no longer used anywhere. Remove it.

**Files:**
- Delete: `src/app/demo/ImageCarousel.tsx`

- [ ] **Step 1: Confirm no remaining imports**

```bash
grep -r "ImageCarousel" src/
```

Expected output: nothing (zero matches).

- [ ] **Step 2: Delete and stage the file**

```bash
git rm src/app/demo/ImageCarousel.tsx
```

- [ ] **Step 3: Run a final type check and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: no errors, no warnings about missing modules.

- [ ] **Step 4: Final visual smoke test**

Run `npm run dev` and verify the full flow:
1. Projects view — all thumbnails are blocky/pixelated
2. Hover a card — dims correctly
3. Click a card — page scrolls to top, card opens with 2-column masonry of clear images
4. Click an image in the opened card — Lightbox opens
5. Close the card
6. Switch to Showreel — single full-width image, crossfades every 3s, each incoming image briefly pixelated then clears

- [ ] **Step 5: Commit**

```bash
git commit -m "chore: delete unused ImageCarousel component"
```
