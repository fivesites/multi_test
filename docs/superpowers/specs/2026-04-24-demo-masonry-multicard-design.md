# Demo Grid: Masonry + MultiCard Expansion

**Date:** 2026-04-24  
**Scope:** `src/app/demo/` — masonry layout, in-place card expansion, image carousel, lightbox

---

## Overview

Upgrade the `/demo` page grid with three features:

1. **True masonry layout** — images flow at their natural aspect ratios using CSS `columns`
2. **MultiCard expansion** — clicking a thumbnail opens a full-width card inline in the column flow (option B), with all project images in a carousel and metadata above
3. **Lightbox** — clicking an image inside the card opens a fullscreen carousel

---

## Files

| File | Action |
|---|---|
| `src/app/demo/page.tsx` | Modify — extend `GridItem` with `title`, `client`, `projectImages[]` |
| `src/app/demo/DemoClient.tsx` | Modify — CSS columns masonry, `openSlug` state, render `MultiCard` in-place |
| `src/app/demo/MultiCard.tsx` | Create — shadcn `Card` with metadata + `ImageCarousel` |
| `src/app/demo/ImageCarousel.tsx` | Create — Embla horizontal carousel with click-to-lightbox |
| `src/app/demo/Lightbox.tsx` | Create — fixed fullscreen Embla carousel |

---

## Data Model

Extend `GridItem` in `DemoClient.tsx`:

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

`page.tsx` already fetches all required fields (`title`, `client`, `media[]`). Each `GridItem` gets `projectImages` populated from the same `work.media` array (all images, not just the first 3).

---

## 1. Masonry Grid

Replace the CSS `grid` in `DemoClient.tsx` with CSS `columns`:

- `columns-2 md:columns-3 gap-2` (or similar)
- Each image wrapper: `break-inside-avoid mb-2`
- Natural aspect ratio via `paddingBottom` trick: `paddingBottom: \`${(1 / item.aspectRatio) * 100}%\``  
  with image `position: absolute; inset: 0`
- Framer Motion `layout` prop on each item so siblings animate when the grid reflows

---

## 2. MultiCard Expansion

### State

```ts
const [openSlug, setOpenSlug] = useState<string | null>(null);
```

### Rendering

When iterating over `displayed` items in "all" mode (one per project):

- If `item.slug === openSlug`: render `<MultiCard>` with `style={{ columnSpan: 'all' }}` in place of the thumbnail
- Otherwise: render the thumbnail as normal, `onClick={() => setOpenSlug(item.slug)}`

Framer Motion `layout` on each sibling item handles the reflow animation when a card opens or closes.

The clicked thumbnail's image transitions into the card's carousel via a shared `layoutId`:
- Thumbnail image: `layoutId={\`thumb-${item.key}\`}`
- First slide of `ImageCarousel`: `layoutId={\`thumb-${item.key}\`}`

### MultiCard Component (`MultiCard.tsx`)

Props:
```ts
{
  title: string;
  client?: string;
  categories: string[];
  slug: string;
  projectImages: { key: string; url: string; aspectRatio: number }[];
  thumbKey: string;       // key of clicked thumbnail, for layoutId handoff
  onClose: () => void;
}
```

Layout (top to bottom inside shadcn `Card`):
1. **Header row**: client name (large, bold) + categories as `Badge` + link to `/work/[slug]` + `×` close button
2. **ImageCarousel**: all `projectImages`, horizontal Embla carousel

---

## 3. ImageCarousel (`ImageCarousel.tsx`)

Props:
```ts
{
  images: { key: string; url: string; aspectRatio: number }[];
  initialIndex?: number;
  thumbKey?: string;       // layoutId of first slide for shared animation
  onImageClick: (index: number) => void;
}
```

Implementation:
- Embla carousel, `loop: false`, `align: 'start'`
- Each slide: image at natural aspect ratio, `max-h-[60vh] w-auto`
- First slide image uses `layoutId={thumbKey}` if provided
- Clicking any slide calls `onImageClick(index)`
- Simple prev/next arrow buttons (icon-only, absolute positioned)

---

## 4. Lightbox (`Lightbox.tsx`)

Props:
```ts
{
  images: { key: string; url: string; aspectRatio: number }[];
  initialIndex: number;
  onClose: () => void;
}
```

Implementation:
- Rendered via `createPortal` into `document.body`
- `position: fixed; inset: 0; z-index: 50` — black backdrop
- Click backdrop to close; `Esc` key listener to close
- Embla carousel initialized at `initialIndex`
- Each slide: `next/image` with `fill` + `object-contain`, within `100vh` height
- Prev/next arrows; slide counter (`2 / 7`)
- `AnimatePresence` fade in/out

---

## Animation Summary

| Interaction | Animation |
|---|---|
| Thumbnail → MultiCard opens | `layout` reflow on siblings; `layoutId` image handoff |
| MultiCard → closes | Reverse: `layout` reflow; `layoutId` image returns to thumbnail |
| Lightbox opens | `AnimatePresence` fade in |
| Lightbox closes | `AnimatePresence` fade out |
| Category filter change | Existing `AnimatePresence mode="popLayout"` (unchanged) |

---

## Constraints

- `ImageCarousel` and `Lightbox` are demo-scoped (`src/app/demo/`) — not shared globally yet
- No changes to the category filter logic
- No changes to the "all" vs category filter behavior — only primary images show in "all" mode
- The `×` close button in MultiCard and the Lightbox backdrop both call `onClose`
- Clicking the link icon in MultiCard navigates to `/work/[slug]` (not closes the card)
