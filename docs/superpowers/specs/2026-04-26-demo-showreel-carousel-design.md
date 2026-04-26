# Demo Page: Showreel Button + Carousel

**Date:** 2026-04-26  
**Scope:** `src/app/demo/DemoClient.tsx`

---

## Goal

Give the Showreel button in the demo top nav its own independent view state and render a horizontal image carousel below the category buttons when it is active.

---

## State

Replace the existing `showProjects: boolean` state with:

```ts
const [view, setView] = useState<null | "showreel" | "projects">(null);
```

Toggling: clicking the active button collapses back to `null`. Clicking the other button switches directly.

This also removes the `showShowReel` undefined variable bug on line 105.

---

## Top Nav Changes

- **Showreel button** — toggles `view === "showreel"`. Uses `glow` variant when active, red link style when inactive.
- **Projects button** — toggles `view === "projects"`. Uses `glow` variant when active, red link style when inactive.
- Multi2 and Connect buttons are unchanged.

---

## Category Filter Row

Always rendered. Interactive only when `view === "projects"`:

- When `view === "projects"`: click handlers active, active category gets `glow` variant.
- When `view !== "projects"`: no click handlers (`pointer-events-none`), all buttons use muted red-200 link style.

---

## Showreel Carousel

Rendered when `view === "showreel"`, below the category filter row.

- Source: first 3 items from `items` where `isPrimary === true`.
- Component: reuse existing `ImageCarousel` from `./ImageCarousel`.
- No `thumbKey` (no shared layout animation needed here).
- `onImageClick` is a no-op for now (lightbox integration deferred to when video is added).

---

## Projects Grid

Unchanged. Only rendered when `view === "projects"`. Category filter applies as before.

---

## Layout Order

1. Top nav row
2. Category filter row (always visible)
3. Showreel carousel (when `view === "showreel"`)
4. Projects masonry grid (when `view === "projects"`)

---

## Out of Scope

- Video support in the carousel (deferred)
- Lightbox from showreel carousel (deferred)
- Category filter affecting the showreel (deferred)
