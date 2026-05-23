import type { PuzzleType } from "@/types/settings.types";

export interface PuzzleButtonConfig {
  type: PuzzleType;
  label: string;
  dialogId: string;
  implemented: boolean;
}

export const PUZZLE_BUTTONS: PuzzleButtonConfig[] = [
  { type: "sudoku", label: "Sudoku", dialogId: "sudoku", implemented: true },
  { type: "calcudoku", label: "CalcuDoku", dialogId: "calcudoku", implemented: false },
  { type: "skyscraper", label: "Skyscraper", dialogId: "skyscraper", implemented: false },
  { type: "nurikabe", label: "Nurikabe", dialogId: "nurikabe", implemented: false },
  { type: "hitori", label: "Hitori", dialogId: "hitori", implemented: false },
  { type: "kakurasu", label: "Kakurasu", dialogId: "kakurasu", implemented: false },
  { type: "numberPlace", label: "Number Place", dialogId: "numberPlace", implemented: false },
  { type: "shikaku", label: "Shikaku", dialogId: "shikaku", implemented: false },
  { type: "rangePuzzle", label: "Range", dialogId: "rangePuzzle", implemented: false },
  { type: "mineFinder", label: "Mine Finder", dialogId: "mineFinder", implemented: false },
  { type: "warships", label: "Warships", dialogId: "warships", implemented: false },
  { type: "ticTacToe", label: "Tic Tac Toe", dialogId: "ticTacToe", implemented: false },
  { type: "ticTacLogic", label: "Tic Tac Logic", dialogId: "ticTacLogic", implemented: false },
  { type: "fourInARow", label: "Four In A Row", dialogId: "fourInARow", implemented: false },
  { type: "abcPath", label: "ABC Path", dialogId: "abcPath", implemented: false },
  { type: "wordSearch", label: "Word Search", dialogId: "wordSearch", implemented: false },
  { type: "crossword", label: "Crossword", dialogId: "crossword", implemented: false },
  { type: "hangman", label: "Hangman", dialogId: "hangman", implemented: false },
  { type: "missingVowels", label: "Missing Vowels", dialogId: "missingVowels", implemented: false },
  { type: "wordScramble", label: "Word Scramble", dialogId: "wordScramble", implemented: false },
  { type: "cryptogram", label: "Cryptogram", dialogId: "cryptogram", implemented: false },
  { type: "wordPuzzle", label: "Word Puzzle", dialogId: "wordPuzzle", implemented: false },
  { type: "kidsMath", label: "Kids Math", dialogId: "kidsMath", implemented: false },
  { type: "oneHundred", label: "One Hundred", dialogId: "oneHundred", implemented: false },
];

export const PUZZLE_DISPLAY_NAMES: Record<PuzzleType, string> = Object.fromEntries(
  PUZZLE_BUTTONS.map((p) => [p.type, p.label])
) as Record<PuzzleType, string>;
