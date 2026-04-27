# Demo Grid: Masonry + MultiCard Expansion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `/demo` with true CSS-columns masonry, an inline-expanding MultiCard that shows a project's full image carousel, and a fullscreen lightbox.

**Architecture:** CSS `columns` replaces CSS `grid` for true masonry. Clicking a thumbnail sets `openSlug` state; the thumbnail exits and a full-width `MultiCard` (with `column-span: all`) enters at that position via `AnimatePresence`. A `layoutId` shared element animates the thumbnail image into the card's first carousel slide. The `Lightbox` renders into `document.body` via a portal.

**Tech Stack:** Next.js App Router, React, TailwindCSS, Framer Motion (`motion/react`), Embla Carousel (`embla-carousel-react`), shadcn/ui Card, lucide-react

---

## File Map

| File | Action |
|---|---|
| `src/app/demo/DemoClient.tsx` | Modify — new `GridItem` type, CSS columns masonry, `openSlug` state |
| `src/app/demo/page.tsx` | Modify — populate `title`, `client`, `projectImages` on each `GridItem` |
| `src/app/demo/ImageCarousel.tsx` | Create — Embla horizontal carousel |
| `src/app/demo/Lightbox.tsx` | Create — fullscreen portal carousel |
| `src/app/demo/MultiCard.tsx` | Create — shadcn Card with metadata + carousel + lightbox |
| `src/components/ui/card.tsx` | Create — add shadcn Card component |

---

## Task 1: Add shadcn Card component

**Files:**
- Create: `src/components/ui/card.tsx`

- [ ] **Step 1: Install the Card component via shadcn CLI**

Run from the project root:
```bash
npx shadcn@latest add card
```

Expected output includes lines like `✔ Done` and creates `src/components/ui/card.tsx`.

- [ ] **Step 2: Verify the file was created**

Run:
```bash
ls src/components/ui/card.tsx
```
Expected: file exists (no error).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/card.tsx
git commit -m "feat: add shadcn Card component"
```

---

## Task 2: Extend GridItem type and update page.tsx

**Files:**
- Modify: `src/app/demo/DemoClient.tsx` (type only — `GridItem` export)
- Modify: `src/app/demo/page.tsx`

- [ ] **Step 1: Update the `GridItem` type in `DemoClient.tsx`**

Replace the current `GridItem` export:

```ts
export type GridItem = {
  key: string;
  url: string;
  alt: string;
  slug: string;
  categories: string[];
  aspectRatio: number;
  isPrimary: boolean;
};
```

With:

```ts
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
```

- [ ] **Step 2: Rewrite the `for (const work of works)` loop in `page.tsx`**

Replace the entire loop body (lines 29–60 in the current file) with:

```ts
for (const work of works) {
  for (const cat of work.categories ?? []) {
    categorySet.add(cat);
  }

  const allImages = (work.media ?? []).filter(
    (m) => m._type === "image" && m.asset,
  );

  const projectImages = allImages.map((img) => ({
    key: img._key,
    url: urlFor(img).width(1600).quality(90).url(),
    aspectRatio: img.aspectRatio ?? 1,
  }));

  const displayImages = allImages.slice(0, 3);

  if (displayImages.length > 0) {
    displayImages.forEach((img, idx) => {
      items.push({
        key: `${work._id}-${img._key}`,
        url: urlFor(img).width(1600).quality(90).url(),
        alt: work.client || work.title,
        slug: work.slug,
        title: work.title,
        client: work.client,
        categories: work.categories ?? [],
        aspectRatio: img.aspectRatio ?? 1,
        isPrimary: idx === 0,
        projectImages,
      });
    });
  } else if (work.coverImage?.asset) {
    const coverUrl = urlFor(work.coverImage).width(1600).quality(90).url();
    items.push({
      key: work._id,
      url: coverUrl,
      alt: work.client || work.title,
      slug: work.slug,
      title: work.title,
      client: work.client,
      categories: work.categories ?? [],
      aspectRatio: work.coverImage.aspectRatio ?? 1,
      isPrimary: true,
      projectImages: [
        {
          key: work._id,
          url: coverUrl,
          aspectRatio: work.coverImage.aspectRatio ?? 1,
        },
      ],
    });
  }
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```
Expected: no errors related to `GridItem`.

- [ ] **Step 4: Commit**

```bash
git add src/app/demo/DemoClient.tsx src/app/demo/page.tsx
git commit -m "feat: extend GridItem with title, client, projectImages"
```

---

## Task 3: Create ImageCarousel

**Files:**
- Create: `src/app/demo/ImageCarousel.tsx`

- [ ] **Step 1: Create the file**

Write `src/app/demo/ImageCarousel.tsx`:

```tsx
"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CarouselImage = { key: string; url: string; aspectRatio: number };

export default function ImageCarousel({
  images,
  thumbKey,
  onImageClick,
}: {
  images: CarouselImage[];
  thumbKey?: string;
  onImageClick: (index: number) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2">
          {images.map((img, i) => {
            const slideWidth = `${img.aspectRatio * 60}vh`;

            return (
              <div
                key={img.key}
                className="flex-none cursor-zoom-in"
                style={{ width: slideWidth, maxWidth: "85vw" }}
                onClick={() => onImageClick(i)}
              >
                {i === 0 && thumbKey ? (
                  <motion.div
                    layoutId={thumbKey}
                    className="relative w-full"
                    style={{
                      paddingBottom: `${(1 / img.aspectRatio) * 100}%`,
                    }}
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="85vw"
                    />
                  </motion.div>
                ) : (
                  <div
                    className="relative w-full"
                    style={{
                      paddingBottom: `${(1 / img.aspectRatio) * 100}%`,
                    }}
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="85vw"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/80"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/80"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/demo/ImageCarousel.tsx
git commit -m "feat: add ImageCarousel component (Embla, horizontal)"
```

---

## Task 4: Create Lightbox

**Files:**
- Create: `src/app/demo/Lightbox.tsx`

- [ ] **Step 1: Create the file**

Write `src/app/demo/Lightbox.tsx`:

```tsx
"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type LightboxImage = { key: string; url: string; aspectRatio: number };

export default function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: initialIndex,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [emblaApi, onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black"
      onClick={onClose}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>

      <div
        className="w-full h-full overflow-hidden"
        ref={emblaRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full">
          {images.map((img) => (
            <div
              key={img.key}
              className="flex-none w-full h-full flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              scrollPrev();
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              scrollNext();
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </motion.div>,
    document.body,
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/demo/Lightbox.tsx
git commit -m "feat: add Lightbox component (fullscreen portal carousel)"
```

---

## Task 5: Create MultiCard

**Files:**
- Create: `src/app/demo/MultiCard.tsx`

- [ ] **Step 1: Create the file**

Write `src/app/demo/MultiCard.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";
import { AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ImageCarousel from "./ImageCarousel";
import Lightbox from "./Lightbox";

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

type ProjectImage = { key: string; url: string; aspectRatio: number };

export default function MultiCard({
  title,
  client,
  categories,
  slug,
  projectImages,
  thumbKey,
  onClose,
}: {
  title: string;
  client?: string;
  categories: string[];
  slug: string;
  projectImages: ProjectImage[];
  thumbKey: string;
  onClose: () => void;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
          <div className="flex flex-col gap-2">
            <p className="text-xl font-semibold leading-tight">
              {client ?? title}
            </p>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <Badge key={cat} variant="secondary">
                  {CATEGORY_LABELS[cat] ?? cat}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/work/${slug}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ImageCarousel
            images={projectImages}
            thumbKey={thumbKey}
            onImageClick={setLightboxIndex}
          />
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

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/demo/MultiCard.tsx
git commit -m "feat: add MultiCard component"
```

---

## Task 6: Rewrite DemoClient for masonry + inline expansion

**Files:**
- Modify: `src/app/demo/DemoClient.tsx`

- [ ] **Step 1: Replace the entire file content**

Write `src/app/demo/DemoClient.tsx`:

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import MultiCard from "./MultiCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [active, setActive] = useState("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const displayed =
    active === "all"
      ? items.filter((i) => i.isPrimary)
      : items.filter((i) => i.categories.includes(active));

  function handleFilterChange(cat: string) {
    setActive(cat);
    setOpenSlug(null);
  }

  return (
    <div className="min-h-screen">
      {/* Filter bar */}
      <Button variant="glow"> Multi2 </Button>
      <div className="flex flex-wrap gap-x-0 gap-y-2">
        {["all", ...categories].map((cat) => (
          <Button
            key={cat}
            variant={active === cat ? "glow" : "link"}
            onClick={() => handleFilterChange(cat)}
            className={cn(
              "font-rounded transition-colors",
              active !== cat &&
                "text-foreground/40 hover:text-foreground no-underline hover:no-underline",
            )}
          >
            {cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
          </Button>
        ))}
      </div>

      {/* Masonry grid — CSS columns */}
      <div className="columns-2 md:columns-3 gap-2 mt-4">
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
                style={{ paddingBottom: `${(1 / item.aspectRatio) * 100}%` }}
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
    </div>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Start dev server and verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000/demo` and verify:

1. Grid renders in masonry columns — images at different natural heights, no uniform row heights
2. Clicking a thumbnail: it fades out and a full-width card appears spanning all columns, with the clicked image animating into the carousel's first slide
3. Card shows client name, category badges, and an `×` close button
4. Carousel scrolls horizontally through all project images
5. Clicking an image in the carousel opens the fullscreen lightbox
6. Lightbox: Esc key closes it, arrow keys navigate, clicking backdrop closes it
7. Clicking `×` in the card closes it and the thumbnail returns
8. Switching filter tabs closes any open card

- [ ] **Step 4: Commit**

```bash
git add src/app/demo/DemoClient.tsx
git commit -m "feat: masonry grid + MultiCard inline expansion"
```
