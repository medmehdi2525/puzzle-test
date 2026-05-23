import type { FontStyle, GridBorderStyle, PuzzleAppearance } from "./appearance.types";
import { DEFAULT_APPEARANCE } from "./appearance.types";

export type { FontStyle, GridBorderStyle, PuzzleAppearance };
export { DEFAULT_APPEARANCE };

export type TrimSize =
  | "5x8"
  | "5.06x7.81"
  | "5.25x8"
  | "5.5x8.5"
  | "6x9"
  | "6.14x9.21"
  | "6.69x9.61"
  | "7x10"
  | "7.44x9.69"
  | "7.5x9.25"
  | "8x10"
  | "8.25x6"
  | "8.25x8.25"
  | "8.27x11.69"
  | "8.5x8.5"
  | "8.5x11";

export type PuzzleType =
  | "sudoku"
  | "calcudoku"
  | "skyscraper"
  | "nurikabe"
  | "hitori"
  | "kakurasu"
  | "numberPlace"
  | "shikaku"
  | "rangePuzzle"
  | "mineFinder"
  | "warships"
  | "ticTacToe"
  | "ticTacLogic"
  | "fourInARow"
  | "abcPath"
  | "wordSearch"
  | "crossword"
  | "hangman"
  | "missingVowels"
  | "wordScramble"
  | "cryptogram"
  | "wordPuzzle"
  | "kidsMath"
  | "oneHundred";

export interface FontSettings {
  gridNumbers: FontStyle;
  clueText: FontStyle;
  wordList: FontStyle;
  title: FontStyle;
  pageNumber: FontStyle;
}

export type PageNumberPosition =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center";

export type PageNumberApplyTo = "all" | "odd" | "even" | "range";

export interface PageNumberSettings {
  startNumber: number;
  position: PageNumberPosition;
  applyTo: PageNumberApplyTo;
  rangeFrom?: number;
  rangeTo?: number;
  enabled: boolean;
}

export interface BookSettings {
  trim: TrimSize;
  bleedEnabled: boolean;
  bleedSize: number;
  gutterSize: number;
  marginTop: number;
  marginBottom: number;
  marginInner: number;
  marginOuter: number;
  fonts: FontSettings;
  pageNumbers: PageNumberSettings;
  appearance: PuzzleAppearance;
  gridBorder: GridBorderStyle;
}

export const DEFAULT_FONT_SETTINGS: FontSettings = {
  gridNumbers: { name: "Inter", size: 14, bold: true },
  clueText: { name: "Inter", size: 10 },
  wordList: { name: "Inter", size: 9 },
  title: { name: "Inter", size: 18, bold: true },
  pageNumber: { name: "Inter", size: 9 },
};

export const DEFAULT_PAGE_NUMBER_SETTINGS: PageNumberSettings = {
  startNumber: 1,
  position: "bottom-center",
  applyTo: "all",
  enabled: false,
};

export const DEFAULT_BOOK_SETTINGS: BookSettings = {
  trim: "8.5x11",
  bleedEnabled: false,
  bleedSize: 0.125,
  gutterSize: 0,
  marginTop: 0.5,
  marginBottom: 0.5,
  marginInner: 0.5,
  marginOuter: 0.5,
  fonts: DEFAULT_FONT_SETTINGS,
  pageNumbers: DEFAULT_PAGE_NUMBER_SETTINGS,
  appearance: DEFAULT_APPEARANCE,
  gridBorder: "full",
};
