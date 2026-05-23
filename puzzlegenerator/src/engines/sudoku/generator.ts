import type { SudokuDifficulty, SudokuGridSize } from "@/types/puzzle.types";
import type { SudokuPuzzleData, SudokuSolutionData } from "@/types/puzzle.types";
import { createRng, shuffle } from "@/lib/prng";
import { cloneBoard, countSolutions, solveSudoku } from "./solver";

const CLUE_RANGES: Record<SudokuDifficulty, [number, number]> = {
  easy: [36, 40],
  medium: [27, 35],
  hard: [22, 26],
  expert: [17, 21],
};

const CLUE_RANGES_4: Record<SudokuDifficulty, [number, number]> = {
  easy: [10, 12],
  medium: [8, 9],
  hard: [6, 7],
  expert: [4, 5],
};

const CLUE_RANGES_16: Record<SudokuDifficulty, [number, number]> = {
  easy: [120, 140],
  medium: [90, 110],
  hard: [70, 85],
  expert: [55, 65],
};

function getClueRange(size: SudokuGridSize, difficulty: SudokuDifficulty): [number, number] {
  if (size === 4) return CLUE_RANGES_4[difficulty];
  if (size === 16) return CLUE_RANGES_16[difficulty];
  const base = CLUE_RANGES[difficulty];
  if (difficulty === "expert") return [17, 21];
  return base;
}

function toDisplay(n: number, useLetters: boolean): number | string {
  if (!useLetters || n <= 9) return n;
  return String.fromCharCode(65 + n - 10);
}

function generateFullGrid(size: SudokuGridSize, rng: () => number): number[][] {
  const board: (number | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null)
  );
  const nums = shuffle(
    Array.from({ length: size }, (_, i) => i + 1),
    rng
  );

  function fill(): boolean {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === null) {
          const order = shuffle([...nums], rng);
          for (const num of order) {
            board[r][c] = num;
            if (solveSudoku(board as number[][])) return true;
            board[r][c] = null;
          }
          return false;
        }
      }
    }
    return true;
  }

  fill();
  return board as number[][];
}

export interface GenerateSudokuResult {
  puzzleData: SudokuPuzzleData;
  solutionData: SudokuSolutionData;
  seed: number;
}

export function generateSudoku(
  seed: number,
  gridSize: SudokuGridSize,
  difficulty: SudokuDifficulty
): GenerateSudokuResult | null {
  const rng = createRng(seed);
  const useLetters = gridSize === 16;
  const [minClues, maxClues] = getClueRange(gridSize, difficulty);
  const targetClues = Math.floor(rng() * (maxClues - minClues + 1)) + minClues;

  for (let attempt = 0; attempt < 100; attempt++) {
    const solution = generateFullGrid(gridSize, rng);
    const puzzle = solution.map((row) => [...row]) as (number | null)[][];
    const cells: [number, number][] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) cells.push([r, c]);
    }
    shuffle(cells, rng);

    let removed = 0;
    const totalCells = gridSize * gridSize;
    const maxRemove = totalCells - targetClues;

    for (const [r, c] of cells) {
      if (removed >= maxRemove) break;
      const backup = puzzle[r][c];
      puzzle[r][c] = null;
      const test = cloneBoard(puzzle);
      if (countSolutions(test, 2) === 1) {
        removed++;
      } else {
        puzzle[r][c] = backup;
      }
    }

    const clueCount = puzzle.flat().filter((v) => v !== null).length;
    if (clueCount >= minClues && clueCount <= maxClues + 2) {
      const clues = puzzle.map((row) =>
        row.map((v) => (v === null ? null : toDisplay(v, useLetters)))
      );
      const sol = solution.map((row) =>
        row.map((v) => toDisplay(v, useLetters))
      );
      return {
        puzzleData: { gridSize, clues, useLetters },
        solutionData: { solution: sol },
        seed,
      };
    }
  }
  return null;
}
