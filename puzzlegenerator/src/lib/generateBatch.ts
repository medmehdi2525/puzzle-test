import type { PuzzleType } from "@/types/settings.types";
import type { GeneratedPuzzle, PuzzlePage } from "@/types/page.types";
import { generatePuzzle, type PuzzleSettings } from "@/engines/registry";
import { deriveSeed } from "@/lib/seed";
import { BatchDeduplicator } from "@/lib/similarity";
import { generateId } from "@/lib/utils";

export interface BatchOptions {
  type: PuzzleType;
  settings: PuzzleSettings;
  baseSeed?: number;
  showSolution?: "yes" | "no" | "separate";
}

export function generatePuzzleBatch(
  options: BatchOptions
): { puzzlePages: PuzzlePage[]; solutionPages: PuzzlePage[] } {
  const pages = (options.settings.pages as number) ?? 1;
  const baseSeed = options.baseSeed ?? Date.now();
  const dedupe = new BatchDeduplicator();
  const puzzlePages: PuzzlePage[] = [];
  const solutionPages: PuzzlePage[] = [];
  const showSolution = options.showSolution ?? "separate";

  for (let i = 0; i < pages; i++) {
    let result = null;
    for (let attempt = 0; attempt < 100; attempt++) {
      const seed = deriveSeed(baseSeed, i, options.type, attempt);
      result = generatePuzzle(options.type, seed, options.settings);
      if (result && dedupe.accept(result.fingerprint)) break;
      result = null;
    }
    if (!result) {
      throw new Error(`Could not generate unique ${options.type} (page ${i + 1})`);
    }

    const puzzle: GeneratedPuzzle = {
      id: generateId(),
      type: options.type,
      settings: { ...options.settings },
      puzzleData: result.puzzleData,
      solutionData: result.solutionData,
      seed: deriveSeed(baseSeed, i, options.type, 0),
    };

    puzzlePages.push({
      id: generateId(),
      pageType: "puzzle",
      puzzles: [puzzle],
      layout: "1",
      elements: [],
    });

    if (showSolution === "separate" || showSolution === "yes") {
      solutionPages.push({
        id: generateId(),
        pageType: "solution",
        puzzles: [{ ...puzzle, id: generateId() }],
        layout: "1",
        elements: [],
      });
    }
  }

  return { puzzlePages, solutionPages };
}
