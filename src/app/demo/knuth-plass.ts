import { prepareWithSegments, type PreparedTextWithSegments } from "@chenglou/pretext";

export { prepareWithSegments };

const SOFT_HYPHEN = "­";
const HUGE_BADNESS = 1e8;
const RIVER_THRESHOLD = 1.5;
const INFEASIBLE_SPACE_RATIO = 0.4;
const TIGHT_SPACE_RATIO = 0.65;
const SHORT_LINE_RATIO = 0.6;

export type LineSegment =
  | { kind: "text"; text: string; width: number }
  | { kind: "space"; width: number };

export type MeasuredLine = {
  segments: LineSegment[];
  wordWidth: number;
  spaceCount: number;
  naturalWidth: number;
  maxWidth: number;
  ending: "paragraph-end" | "wrap";
  trailingMarker: "none" | "soft-hyphen";
};

type BreakCandidateKind = "start" | "space" | "soft-hyphen" | "end";
type BreakCandidate = { segIndex: number; kind: BreakCandidateKind };
type LineStats = {
  wordWidth: number;
  spaceCount: number;
  naturalWidth: number;
  trailingMarker: "none" | "soft-hyphen";
};

function isSpace(text: string) {
  return text.trim().length === 0;
}

function getLineStats(
  segments: readonly string[],
  widths: readonly number[],
  candidates: readonly BreakCandidate[],
  fromC: number,
  toC: number,
  hyphenWidth: number,
  normalSpaceWidth: number,
): LineStats {
  const from = candidates[fromC]!.segIndex;
  const to = candidates[toC]!.segIndex;
  const trailingMarker =
    candidates[toC]!.kind === "soft-hyphen" ? "soft-hyphen" : ("none" as const);
  let wordWidth = 0;
  let spaceCount = 0;
  for (let i = from; i < to; i++) {
    const t = segments[i]!;
    if (t === SOFT_HYPHEN) continue;
    if (isSpace(t)) { spaceCount++; continue; }
    wordWidth += widths[i]!;
  }
  if (to > from && isSpace(segments[to - 1]!)) spaceCount--;
  if (trailingMarker === "soft-hyphen") wordWidth += hyphenWidth;
  return {
    wordWidth,
    spaceCount,
    naturalWidth: wordWidth + spaceCount * normalSpaceWidth,
    trailingMarker,
  };
}

function badness(
  stats: LineStats,
  maxWidth: number,
  normalSpaceWidth: number,
  isLastLine: boolean,
): number {
  if (isLastLine) return stats.wordWidth > maxWidth ? HUGE_BADNESS : 0;
  if (stats.spaceCount <= 0) {
    const slack = maxWidth - stats.wordWidth;
    return slack < 0 ? HUGE_BADNESS : slack * slack * 10;
  }
  const justifiedSpace = (maxWidth - stats.wordWidth) / stats.spaceCount;
  if (justifiedSpace < 0) return HUGE_BADNESS;
  if (justifiedSpace < normalSpaceWidth * INFEASIBLE_SPACE_RATIO) return HUGE_BADNESS;
  const r = Math.abs((justifiedSpace - normalSpaceWidth) / normalSpaceWidth);
  const lineBad = r * r * r * 1000;
  const riverExcess = justifiedSpace / normalSpaceWidth - RIVER_THRESHOLD;
  const riverPenalty = riverExcess > 0 ? 5000 + riverExcess * riverExcess * 10000 : 0;
  const tight = normalSpaceWidth * TIGHT_SPACE_RATIO;
  const tightPenalty =
    justifiedSpace < tight ? 3000 + (tight - justifiedSpace) ** 2 * 10000 : 0;
  const hyphenPenalty = stats.trailingMarker === "soft-hyphen" ? 50 : 0;
  return lineBad + riverPenalty + tightPenalty + hyphenPenalty;
}

function buildLine(
  prepared: PreparedTextWithSegments,
  candidates: readonly BreakCandidate[],
  fromC: number,
  toC: number,
  maxWidth: number,
  hyphenWidth: number,
): MeasuredLine {
  const from = candidates[fromC]!.segIndex;
  const to = candidates[toC]!.segIndex;
  const ending = candidates[toC]!.kind === "end" ? "paragraph-end" : ("wrap" as const);
  const trailingMarker =
    candidates[toC]!.kind === "soft-hyphen" ? "soft-hyphen" : ("none" as const);
  const widths = prepared.widths;
  const segs: LineSegment[] = [];
  for (let i = from; i < to; i++) {
    const text = prepared.segments[i]!;
    if (text === SOFT_HYPHEN) continue;
    segs.push(
      isSpace(text)
        ? { kind: "space", width: widths[i]! }
        : { kind: "text", text, width: widths[i]! },
    );
  }
  if (trailingMarker === "soft-hyphen" && ending === "wrap") {
    segs.push({ kind: "text", text: "-", width: hyphenWidth });
  }
  while (segs.length > 0 && segs[segs.length - 1]!.kind === "space") segs.pop();
  let wordWidth = 0, spaceCount = 0, naturalWidth = 0;
  for (const seg of segs) {
    naturalWidth += seg.width;
    if (seg.kind === "space") spaceCount++;
    else wordWidth += seg.width;
  }
  return { segments: segs, wordWidth, spaceCount, naturalWidth, maxWidth, ending, trailingMarker };
}

export function layoutOptimal(
  prepared: PreparedTextWithSegments,
  maxWidth: number,
  normalSpaceWidth: number,
  hyphenWidth: number,
): MeasuredLine[] {
  const { segments } = prepared;
  const widths = prepared.widths;
  const n = segments.length;
  if (n === 0) return [];

  const candidates: BreakCandidate[] = [{ segIndex: 0, kind: "start" }];
  for (let i = 0; i < n; i++) {
    const t = segments[i]!;
    if (t === SOFT_HYPHEN) {
      if (i + 1 < n) candidates.push({ segIndex: i + 1, kind: "soft-hyphen" });
      continue;
    }
    if (isSpace(t) && i + 1 < n)
      candidates.push({ segIndex: i + 1, kind: "space" });
  }
  candidates.push({ segIndex: n, kind: "end" });

  const c = candidates.length;
  const dp = new Array<number>(c).fill(Infinity);
  const prev = new Array<number>(c).fill(-1);
  dp[0] = 0;

  for (let toC = 1; toC < c; toC++) {
    const isLastLine = candidates[toC]!.kind === "end";
    for (let fromC = toC - 1; fromC >= 0; fromC--) {
      if (dp[fromC] === Infinity) continue;
      const stats = getLineStats(segments, widths, candidates, fromC, toC, hyphenWidth, normalSpaceWidth);
      if (stats.naturalWidth > maxWidth * 2) break;
      const total = dp[fromC]! + badness(stats, maxWidth, normalSpaceWidth, isLastLine);
      if (total < dp[toC]!) {
        dp[toC] = total;
        prev[toC] = fromC;
      }
    }
  }

  const breakIndices: number[] = [];
  let cur = c - 1;
  while (cur > 0) {
    if (prev[cur] === -1) { cur--; continue; }
    breakIndices.push(cur);
    cur = prev[cur]!;
  }
  breakIndices.reverse();

  const lines: MeasuredLine[] = [];
  let fromC = 0;
  for (const toC of breakIndices) {
    lines.push(buildLine(prepared, candidates, fromC, toC, maxWidth, hyphenWidth));
    fromC = toC;
  }
  return lines;
}

// ── Hyphenation ───────────────────────────────────────────────────────────────

const PREFIXES = [
  "multi", "extra", "inter", "intra", "micro", "macro", "ultra", "super",
  "trans", "anti", "auto", "semi", "over", "under", "mis", "dis", "non",
  "out", "pre", "pro", "sub", "re", "un", "co", "de",
];
const SUFFIXES = [
  "tions", "tion", "ally", "ment", "ness", "less", "able", "ible",
  "ical", "ing", "ful", "ity",
];

function hyphenateWord(word: string): string[] {
  if (word.length < 6) return [word];
  const lower = word.toLowerCase().replace(/[²''']/g, "");
  for (const prefix of PREFIXES) {
    if (lower.startsWith(prefix) && lower.length - prefix.length >= 3) {
      const rest = word.slice(prefix.length);
      return [word.slice(0, prefix.length), ...hyphenateWord(rest)];
    }
  }
  for (const suffix of SUFFIXES) {
    if (lower.endsWith(suffix) && lower.length - suffix.length >= 3) {
      const cut = word.length - suffix.length;
      return [...hyphenateWord(word.slice(0, cut)), word.slice(cut)];
    }
  }
  return [word];
}

export function hyphenateText(text: string): string {
  return text
    .split(/(\s+)/)
    .map((token) => {
      if (/^\s+$/.test(token)) return token;
      const m = token.match(/^([\w²''']+)([.,;:!?"—–-]*)$/);
      if (!m) return token;
      const parts = hyphenateWord(m[1]!);
      return (parts.length > 1 ? parts.join(SOFT_HYPHEN) : m[1]!) + m[2]!;
    })
    .join("");
}
