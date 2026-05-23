import type { SudokuPuzzleData, SudokuSolutionData } from "@/types/puzzle.types";

interface SudokuSvgProps {
  data: SudokuPuzzleData;
  solution?: SudokuSolutionData;
  x: number;
  y: number;
  size: number;
  fontName?: string;
  fontSize?: number;
  showSolution?: boolean;
}

export function SudokuSvg({
  data,
  solution,
  x,
  y,
  size,
  fontName = "Inter, sans-serif",
  fontSize = 14,
  showSolution = false,
}: SudokuSvgProps) {
  const n = data.gridSize;
  const cell = size / n;
  const box =
    n === 4 ? 2 : n === 9 ? 3 : n === 16 ? 4 : Math.sqrt(n);
  const grid = showSolution && solution ? solution.solution : data.clues;

  const thick = Math.max(1.5, cell * 0.04);
  const thin = Math.max(0.5, cell * 0.015);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {Array.from({ length: n }).map((_, r) =>
        Array.from({ length: n }).map((_, c) => {
          const val = grid[r]?.[c];
          if (val === null || val === undefined || val === "") return null;
          return (
            <text
              key={`${r}-${c}`}
              x={c * cell + cell / 2}
              y={r * cell + cell / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={fontName}
              fontSize={n === 16 ? fontSize * 0.65 : fontSize}
              fill="#000"
              fontWeight={showSolution ? 400 : 600}
            >
              {String(val)}
            </text>
          );
        })
      )}
      {Array.from({ length: n + 1 }).map((_, i) => {
        const isBoxLine = i % box === 0;
        const strokeWidth = isBoxLine ? thick : thin;
        return (
          <g key={`lines-${i}`}>
            <line
              x1={0}
              y1={i * cell}
              x2={size}
              y2={i * cell}
              stroke="#000"
              strokeWidth={strokeWidth}
            />
            <line
              x1={i * cell}
              y1={0}
              x2={i * cell}
              y2={size}
              stroke="#000"
              strokeWidth={strokeWidth}
            />
          </g>
        );
      })}
      <rect
        x={0}
        y={0}
        width={size}
        height={size}
        fill="none"
        stroke="#000"
        strokeWidth={thick}
      />
    </g>
  );
}
