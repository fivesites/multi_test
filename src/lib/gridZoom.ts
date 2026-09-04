/**
 * Discrete zoom stops for the desktop project grid. Fewer columns = larger
 * thumbnails, so "zoom in" walks the list left, "zoom out" walks it right.
 */
export const COL_STEPS = [1, 3, 6, 9, 12] as const;

/** Column count the grid opens on. */
export const DEFAULT_COLS = 6;

/** Index of the stop nearest `cols` — keeps stepping sane if state ever holds
 *  an off-scale value. */
function nearestStepIndex(cols: number): number {
  let best = 0;
  for (let i = 1; i < COL_STEPS.length; i++) {
    if (Math.abs(COL_STEPS[i] - cols) < Math.abs(COL_STEPS[best] - cols)) {
      best = i;
    }
  }
  return best;
}

/** Next stop toward larger thumbnails (fewer columns). */
export function zoomInCols(cols: number): number {
  return COL_STEPS[Math.max(0, nearestStepIndex(cols) - 1)];
}

/** Next stop toward more columns. */
export function zoomOutCols(cols: number): number {
  return COL_STEPS[Math.min(COL_STEPS.length - 1, nearestStepIndex(cols) + 1)];
}
