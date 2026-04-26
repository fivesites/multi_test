# Demo: Pixelated Grid + Showreel Redesign

**Date:** 2026-04-26

## Overview

Two related changes to the demo page: (1) all project grid thumbnails render pixelated until a card is opened, and (2) the showreel becomes a single-image auto-crossfade slideshow where each incoming image de-pixelates as it settles.

---

## Feature 1: Pixelated Grid Thumbnails

### Behavior

All images in the projects grid are pixelated in their closed (default) state. Clicking a card opens it (existing opacity+layout animation) and the card scrolls to the top of the viewport. The opened card's masonry grid shows full-resolution, clear images.

### Pixelation technique: two-layer stack

Each closed grid card renders two stacked images:

1. **Bottom layer** — standard `<Image fill>` full-res, pre-loads invisibly. Ensures instant reveal when card opens.
2. **Top layer** — tiny `<Image>` with explicit `width={tinyW}` and `height={tinyH}`, styled to stretch to fill the container with `image-rendering: pixelated`. This is always visible in the closed state.

Square pixels are maintained by computing the tiny dimensions from the container's aspect ratio:

```ts
const tinyW = 16
const tinyH = Math.round(16 / item.aspectRatio)
```

A 3:2 image → `16×11`. A portrait 2:3 → `16×24`. A square → `16×16`. When the browser scales this tiny image to fill the container, each pixel cell is geometrically square.

### Snap to top

When `openSlug` is set in `DemoClient`, a `useEffect` fires and calls `scrollIntoView({ behavior: 'smooth', block: 'start' })` on the opened card's DOM element via a ref.

---

## Feature 2: Opened Card Masonry Grid

`MultiCard` replaces its `ImageCarousel` with a 2-column CSS masonry grid (`columns-2 gap-2`). Images are full-resolution and clear. Clicking any image still opens the `Lightbox`.

The `thumbKey`/`layoutId` shared layout animation is removed — the card open animation (opacity) is sufficient.

---

## Feature 3: Showreel Slideshow

### Behavior

A new `ShowreelSlideshow` component replaces the `ImageCarousel` in the showreel section of `DemoClient`. It shows one image at a time, auto-advances every 3 seconds, and loops.

### Crossfade + de-pixelation

Each slide transition uses Framer Motion `AnimatePresence` (default sync mode) with slides absolutely positioned inside a fixed-height container so enter and exit animate simultaneously. The entering image uses the same two-layer technique:

- Full-res layer: fades in (opacity 0→1, duration ~0.8s)
- Pixelated overlay layer: starts at opacity 1, fades to 0 simultaneously

Net effect: the incoming image appears blocky/pixelated and de-pixelates as it settles. The exiting image fades out (opacity 1→0) in parallel.

Tiny dimensions use the same square-pixel formula: `tinyW=16, tinyH=Math.round(16/aspectRatio)`.

No manual prev/next controls — auto-advance only.

---

## Components

| File | Change |
|------|--------|
| `src/app/demo/DemoClient.tsx` | Add two-layer pixelated thumbnails to grid cards; add `useEffect` scroll-to-top on `openSlug` change |
| `src/app/demo/MultiCard.tsx` | Replace `ImageCarousel` with 2-column masonry grid; remove `thumbKey` prop |
| `src/app/demo/ShowreelSlideshow.tsx` | New component — single-image crossfade slideshow with de-pixelation |
| `src/app/demo/ImageCarousel.tsx` | Delete — no longer used |
| `src/app/demo/Lightbox.tsx` | Unchanged |

---

## Open Questions / Constraints

- `next/image` requires explicit `width`/`height` when not using `fill`. The tiny overlay images use explicit dimensions — Next.js will serve them via its optimizer at the computed size (e.g. `/api/image?url=...&w=16&q=75`).
- The tiny images are intentionally low quality — the pixelated effect is the point, not accuracy.
- The `CATEGORY_LABELS` constant is duplicated in `DemoClient.tsx` and `MultiCard.tsx` — out of scope for this change, leave as-is.
