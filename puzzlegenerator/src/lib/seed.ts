import type { PuzzleType } from "@/types/settings.types";
import { createRng } from "./prng";

/** Deterministic per-page seed with type salt — avoids look-alike sequences */
export function deriveSeed(
  baseSeed: number,
  pageIndex: number,
  puzzleType: PuzzleType,
  attempt = 0
): number {
  let h = (baseSeed >>> 0) ^ Math.imul(pageIndex + 1, 0x9e3779b1);
  h = Math.imul(h ^ attempt, 0x85ebca6b);
  for (let i = 0; i < puzzleType.length; i++) {
    h = Math.imul(h ^ puzzleType.charCodeAt(i), 0xc2b2ae35);
  }
  return (h ^ (h >>> 16)) >>> 0;
}

/** Pick removal pattern index for sudoku etc. — rotates per page */
export function pickVariationIndex(
  seed: number,
  slotCount: number
): number {
  const rng = createRng(seed);
  return Math.floor(rng() * slotCount);
}

export function batchBaseSeed(): number {
  return (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
}
