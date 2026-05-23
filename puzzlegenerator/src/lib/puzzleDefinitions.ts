import type { PuzzleType } from "@/types/settings.types";
import { WORD_CATEGORY_OPTIONS } from "@/engines/registry";

export type FieldType =
  | "number"
  | "select"
  | "checkbox"
  | "text";

export interface PuzzleFieldDef {
  key: string;
  label: string;
  type: FieldType;
  default: unknown;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

export interface PuzzleDefinition {
  type: PuzzleType;
  label: string;
  fields: PuzzleFieldDef[];
  defaultShowSolution?: "yes" | "no" | "separate";
}

const diffOpts = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "expert", label: "Expert" },
];

const catOpts = WORD_CATEGORY_OPTIONS.map((c) => ({
  value: c,
  label: c.charAt(0).toUpperCase() + c.slice(1),
}));

const solutionField: PuzzleFieldDef = {
  key: "showSolution",
  label: "Show solution",
  type: "select",
  default: "separate",
  options: [
    { value: "no", label: "No" },
    { value: "yes", label: "Same page" },
    { value: "separate", label: "Separate page" },
  ],
};

export const PUZZLE_DEFINITIONS: PuzzleDefinition[] = [
  {
    type: "sudoku",
    label: "Sudoku",
    fields: [
      { key: "difficulty", label: "Difficulty", type: "select", default: "medium", options: diffOpts },
      {
        key: "gridSize",
        label: "Grid",
        type: "select",
        default: "9",
        options: [
          { value: "4", label: "4×4" },
          { value: "9", label: "9×9" },
          { value: "16", label: "16×16" },
        ],
      },
      solutionField,
    ],
  },
  {
    type: "wordSearch",
    label: "Word Search",
    fields: [
      { key: "gridSize", label: "Grid size", type: "number", default: 12, min: 10, max: 20 },
      { key: "wordCount", label: "Words", type: "number", default: 12, min: 5, max: 20 },
      { key: "category", label: "Category", type: "select", default: "animals", options: catOpts },
      solutionField,
    ],
  },
  {
    type: "crossword",
    label: "Crossword",
    fields: [
      { key: "category", label: "Word list", type: "select", default: "animals", options: catOpts },
      solutionField,
    ],
  },
  {
    type: "wordScramble",
    label: "Word Scramble",
    fields: [
      { key: "category", label: "Category", type: "select", default: "animals", options: catOpts },
      solutionField,
    ],
  },
  {
    type: "hangman",
    label: "Hangman",
    fields: [
      { key: "category", label: "Category", type: "select", default: "animals", options: catOpts },
      { key: "preReveal", label: "Pre-reveal letters", type: "number", default: 0, min: 0, max: 3 },
      solutionField,
    ],
  },
  {
    type: "cryptogram",
    label: "Cryptogram",
    fields: [
      { key: "hintCount", label: "Hints revealed", type: "number", default: 2, min: 0, max: 5 },
      solutionField,
    ],
  },
  {
    type: "missingVowels",
    label: "Missing Vowels",
    fields: [
      { key: "category", label: "Category", type: "select", default: "food", options: catOpts },
      solutionField,
    ],
  },
  {
    type: "kidsMath",
    label: "Kids Math",
    fields: [
      { key: "equationsPerPage", label: "Equations", type: "number", default: 12, min: 4, max: 24 },
      { key: "min", label: "Min number", type: "number", default: 1, min: 0, max: 50 },
      { key: "max", label: "Max number", type: "number", default: 20, min: 5, max: 100 },
      solutionField,
    ],
  },
  {
    type: "oneHundred",
    label: "One Hundred",
    fields: [
      {
        key: "gridSize",
        label: "Grid",
        type: "select",
        default: "3",
        options: [
          { value: "3", label: "3×3" },
          { value: "4", label: "4×4" },
        ],
      },
      { key: "target", label: "Target sum", type: "number", default: 100, min: 20, max: 200 },
      solutionField,
    ],
  },
  {
    type: "calcudoku",
    label: "CalcuDoku",
    fields: [
      { key: "gridSize", label: "Size", type: "number", default: 5, min: 4, max: 7 },
      { key: "difficulty", label: "Difficulty", type: "select", default: "medium", options: diffOpts },
      solutionField,
    ],
  },
  {
    type: "skyscraper",
    label: "Skyscraper",
    fields: [
      { key: "gridSize", label: "Size", type: "number", default: 4, min: 4, max: 7 },
      solutionField,
    ],
  },
  {
    type: "nurikabe",
    label: "Nurikabe",
    fields: [
      { key: "gridSize", label: "Size", type: "number", default: 8, min: 5, max: 12 },
      solutionField,
    ],
  },
  {
    type: "hitori",
    label: "Hitori",
    fields: [
      { key: "gridSize", label: "Size", type: "number", default: 6, min: 5, max: 10 },
      solutionField,
    ],
  },
  {
    type: "kakurasu",
    label: "Kakurasu",
    fields: [
      { key: "gridSize", label: "Size", type: "number", default: 6, min: 5, max: 10 },
      solutionField,
    ],
  },
  {
    type: "shikaku",
    label: "Shikaku",
    fields: [
      { key: "gridSize", label: "Size", type: "number", default: 8, min: 6, max: 12 },
      solutionField,
    ],
  },
  {
    type: "rangePuzzle",
    label: "Range",
    fields: [
      { key: "gridSize", label: "Size", type: "number", default: 7, min: 5, max: 10 },
      solutionField,
    ],
  },
  {
    type: "mineFinder",
    label: "Mine Finder",
    fields: [
      { key: "gridSize", label: "Size", type: "number", default: 8, min: 6, max: 12 },
      { key: "mines", label: "Mines", type: "number", default: 10, min: 5, max: 20 },
      solutionField,
    ],
  },
  {
    type: "warships",
    label: "Warships",
    fields: [
      { key: "gridSize", label: "Size", type: "number", default: 8, min: 8, max: 10 },
      solutionField,
    ],
  },
  {
    type: "ticTacToe",
    label: "Tic Tac Toe",
    fields: [
      {
        key: "gridSize",
        label: "Grid",
        type: "select",
        default: "3",
        options: [
          { value: "3", label: "3×3" },
          { value: "5", label: "5×5" },
        ],
      },
      { key: "preFilled", label: "Pre-filled", type: "number", default: 3, min: 0, max: 5 },
      solutionField,
    ],
  },
  {
    type: "ticTacLogic",
    label: "Tic Tac Logic",
    fields: [
      { key: "gridSize", label: "Size", type: "number", default: 6, min: 6, max: 10 },
      solutionField,
    ],
  },
  {
    type: "fourInARow",
    label: "Four In A Row",
    fields: [solutionField],
  },
  {
    type: "abcPath",
    label: "ABC Path",
    fields: [
      {
        key: "gridSize",
        label: "Grid",
        type: "select",
        default: "5",
        options: [
          { value: "5", label: "5×5" },
          { value: "7", label: "7×7" },
        ],
      },
      solutionField,
    ],
  },
  {
    type: "wordPuzzle",
    label: "Word Puzzle",
    fields: [
      {
        key: "gridSize",
        label: "Grid",
        type: "select",
        default: "4",
        options: [
          { value: "4", label: "4×4" },
          { value: "5", label: "5×5" },
        ],
      },
      solutionField,
    ],
  },
  {
    type: "numberPlace",
    label: "Number Place",
    fields: [
      { key: "difficulty", label: "Difficulty", type: "select", default: "medium", options: diffOpts },
      solutionField,
    ],
  },
];

export function getPuzzleDefinition(type: PuzzleType): PuzzleDefinition | undefined {
  return PUZZLE_DEFINITIONS.find((d) => d.type === type);
}

export function coerceSettings(
  def: PuzzleDefinition,
  raw: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = { pages: raw.pages, margins: raw.margins, startPage: raw.startPage };
  for (const f of def.fields) {
    let v = raw[f.key] ?? f.default;
    if (f.type === "number" || f.key === "gridSize")
      v = parseInt(String(v), 10) || (f.default as number);
    out[f.key] = v;
  }
  return out;
}
