export type SudokuDifficulty = "easy" | "medium" | "hard" | "expert";
export type SudokuGridSize = 4 | 9 | 16;
export type SudokuSolutionMode = "yes" | "no" | "separate";

export interface SudokuSettings {
  pages: number;
  difficulty: SudokuDifficulty;
  gridSize: SudokuGridSize;
  fontName: string;
  fontSize: number;
  margins: number;
  startPage: number;
  showSolution: SudokuSolutionMode;
}

export interface SudokuPuzzleData {
  gridSize: SudokuGridSize;
  clues: (number | string | null)[][];
  useLetters: boolean;
}

export interface SudokuSolutionData {
  solution: (number | string)[][];
}

export interface BasePuzzleFormFields {
  pages: number;
  margins: number;
  startPage: number;
}

export const FONT_SIZE_OPTIONS = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36,
] as const;
