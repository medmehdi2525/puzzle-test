import type { PuzzleType } from "./settings.types";

export type PageType = "puzzle" | "solution" | "blank" | "divider";
export type PageLayout = "1" | "2" | "4" | "6";

export interface CanvasElement {
  id: string;
  kind: "puzzle" | "image" | "text" | "pageNumber";
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  puzzleId?: string;
  imageSrc?: string;
  text?: string;
}

export interface GeneratedPuzzle {
  id: string;
  type: PuzzleType;
  settings: Record<string, unknown>;
  puzzleData: unknown;
  solutionData: unknown;
  seed: number;
}

export interface PuzzlePage {
  id: string;
  pageType: PageType;
  title?: string;
  puzzles: GeneratedPuzzle[];
  layout: PageLayout;
  elements: CanvasElement[];
}
