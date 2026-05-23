import type { GeneratedPuzzle, PuzzlePage } from "@/types/page.types";
import type { SudokuSettings } from "@/types/puzzle.types";
import { generateId } from "@/lib/utils";
import { generateSudoku } from "@/engines/sudoku/generator";

export function buildSudokuPages(
  settings: SudokuSettings,
  baseSeed: number
): { puzzlePages: PuzzlePage[]; solutionPages: PuzzlePage[] } {
  const puzzlePages: PuzzlePage[] = [];
  const solutionPages: PuzzlePage[] = [];

  for (let i = 0; i < settings.pages; i++) {
    const seed = baseSeed + i;
    const result = generateSudoku(seed, settings.gridSize, settings.difficulty);
    if (!result) {
      throw new Error(`Failed to generate Sudoku after retries (page ${i + 1})`);
    }

    const puzzle: GeneratedPuzzle = {
      id: generateId(),
      type: "sudoku",
      settings: { ...settings },
      puzzleData: result.puzzleData,
      solutionData: result.solutionData,
      seed: result.seed,
    };

    puzzlePages.push({
      id: generateId(),
      pageType: "puzzle",
      puzzles: [puzzle],
      layout: "1",
      elements: [],
    });

    if (settings.showSolution === "separate" || settings.showSolution === "yes") {
      solutionPages.push({
        id: generateId(),
        pageType: "solution",
        puzzles: [
          {
            ...puzzle,
            id: generateId(),
          },
        ],
        layout: "1",
        elements: [],
      });
    }
  }

  return { puzzlePages, solutionPages };
}
