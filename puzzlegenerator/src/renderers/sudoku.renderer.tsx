import type { SudokuPuzzleData, SudokuSolutionData } from "@/types/puzzle.types";
import type { GridBorderStyle } from "@/types/appearance.types";
import { GridSvg, type GridCell } from "./grid.renderer";

interface SudokuSvgProps {
  data: SudokuPuzzleData;
  solution?: SudokuSolutionData;
  x: number;
  y: number;
  size: number;
  fontName?: string;
  fontSize?: number;
  fontBold?: boolean;
  showSolution?: boolean;
  borderStyle?: GridBorderStyle;
}

export function SudokuSvg({
  data,
  solution,
  x,
  y,
  size,
  fontName = "Inter",
  fontSize = 14,
  fontBold = true,
  showSolution = false,
  borderStyle = "full",
}: SudokuSvgProps) {
  const n = data.gridSize;
  const box = n === 4 ? 2 : n === 9 ? 3 : 4;
  const grid = showSolution && solution ? solution.solution : data.clues;
  const cells: GridCell[][] = grid.map((row) =>
    row.map((v) => ({
      value: v === null || v === undefined ? null : v,
    }))
  );

  return (
    <GridSvg
      rows={n}
      cols={n}
      cells={cells}
      x={x}
      y={y}
      size={size}
      boxWidth={box}
      boxHeight={box}
      borderStyle={borderStyle}
      font={{ name: fontName, size: fontSize, bold: fontBold }}
      showSolution={showSolution}
    />
  );
}
