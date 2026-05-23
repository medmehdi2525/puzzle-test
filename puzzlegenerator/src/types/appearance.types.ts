export type GridBorderStyle =
  | "full"
  | "light"
  | "none"
  | "dotted"
  | "outer-only"
  | "cells-only";

export interface FontStyle {
  name: string;
  size: number;
  bold?: boolean;
  italic?: boolean;
  letterSpacing?: number;
}

export interface PuzzleAppearance {
  gridBorder: GridBorderStyle;
  cellPadding: number;
  alternateShading: boolean;
  showTitle: boolean;
}

export const DEFAULT_APPEARANCE: PuzzleAppearance = {
  gridBorder: "full",
  cellPadding: 0.08,
  alternateShading: false,
  showTitle: true,
};

export const GRID_BORDER_LABELS: Record<GridBorderStyle, string> = {
  full: "Full borders",
  light: "Light grid",
  none: "No borders",
  dotted: "Dotted lines",
  "outer-only": "Outer frame only",
  "cells-only": "Cell dividers only",
};

export function fontStyleToCss(f: FontStyle): {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: string;
  letterSpacing?: string;
} {
  return {
    fontFamily: f.name,
    fontSize: f.size,
    fontWeight: f.bold ? 700 : 400,
    fontStyle: f.italic ? "italic" : "normal",
    letterSpacing: f.letterSpacing ? `${f.letterSpacing}px` : undefined,
  };
}

export function fontStyleToSvg(f: FontStyle): {
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  fontStyle: string;
  letterSpacing?: number;
} {
  return {
    fontFamily: `${f.name}, sans-serif`,
    fontSize: f.size,
    fontWeight: f.bold ? "bold" : "normal",
    fontStyle: f.italic ? "italic" : "normal",
    letterSpacing: f.letterSpacing,
  };
}
