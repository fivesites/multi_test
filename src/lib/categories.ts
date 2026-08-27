/**
 * Display labels for the free-form category strings the CMS stores.
 * Kept in one place: renames used to have to be repeated in every component
 * that showed a category.
 */
export const CATEGORY_LABELS: Record<string, string> = {
  photo: "Photo",
  video: "Video",
  production: "Production",
  "art-direction": "Art Direction",
  concept: "Concept",
  "sound-design": "Sound Design",
  vax: "Vax",
  dop: "DOP",
  "post-processing": "Post-prod",
  "post-production": "Post-prod",
  music: "Music Prod",
  "music-production": "Music Prod",
};

export const getCategoryLabel = (cat: string) => CATEGORY_LABELS[cat] ?? cat;

/** Deduped, comma-joined labels — two slugs can render the same label. */
export function formatCategories(cats: string[]) {
  const seen = new Set<string>();
  return cats
    .map(getCategoryLabel)
    .filter((label) => {
      const key = label.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(", ");
}

/** Heading for the projects list — the active filter, or "All Projects". */
export const getActiveFilterLabel = (activeFilter: string) =>
  activeFilter === "all" ? "All Projects" : getCategoryLabel(activeFilter);
