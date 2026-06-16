const NAV_LOGO_CHARS = 6; // "Multi²"
const LOGO_APPEAR_MS = 80;

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

const TYPING_MS_PER_CHAR = 22;
const SEARCH_PLACEHOLDER = "Search...";

function getFilterLabel(cat: string): string {
  return cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat);
}

export function getFilterDoneMs(categories: string[]): number {
  const allCats = ["all", ...categories];
  const filterDelays = allCats.reduce<number[]>((acc, _cat, i) => {
    if (i === 0) return [0];
    const prevLabel = getFilterLabel(allCats[i - 1]);
    return [...acc, acc[i - 1] + (prevLabel.length + 2) * TYPING_MS_PER_CHAR];
  }, []);
  const lastCat = allCats[allCats.length - 1];
  return filterDelays[allCats.length - 1] + (getFilterLabel(lastCat).length + 2) * TYPING_MS_PER_CHAR;
}

export function getPostLoadFilterDoneMs(categories: string[]): number {
  return NAV_LOGO_CHARS * TYPING_MS_PER_CHAR + LOGO_APPEAR_MS + getFilterDoneMs(categories);
}

export function getNavTypingDelayMs(categories: string[]): number {
  const allCats = ["all", ...categories];
  const filterDelays = allCats.reduce<number[]>((acc, _cat, i) => {
    if (i === 0) return [0];
    const prevLabel = getFilterLabel(allCats[i - 1]);
    return [...acc, acc[i - 1] + (prevLabel.length + 2) * TYPING_MS_PER_CHAR];
  }, []);
  const lastCat = allCats[allCats.length - 1];
  const searchDelay =
    filterDelays[allCats.length - 1] +
    (getFilterLabel(lastCat).length + 2) * TYPING_MS_PER_CHAR;
  return searchDelay + SEARCH_PLACEHOLDER.length * TYPING_MS_PER_CHAR;
}
