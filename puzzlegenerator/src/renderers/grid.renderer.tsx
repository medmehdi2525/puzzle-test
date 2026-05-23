import type { FontStyle, GridBorderStyle } from "@/types/appearance.types";
import { fontStyleToSvg } from "@/types/appearance.types";

export interface GridCell {
  value?: string | number | null;
  fill?: string;
  bold?: boolean;
}

interface GridSvgProps {
  rows: number;
  cols: number;
  cells: GridCell[][];
  x: number;
  y: number;
  size: number;
  boxWidth?: number;
  boxHeight?: number;
  borderStyle?: GridBorderStyle;
  font?: FontStyle;
  alternateShading?: boolean;
  showSolution?: boolean;
  solutionCells?: GridCell[][];
}

export function GridSvg({
  rows,
  cols,
  cells,
  x,
  y,
  size,
  boxWidth = cols === 9 ? 3 : cols <= 4 ? 2 : Math.round(Math.sqrt(cols)),
  boxHeight = boxWidth,
  borderStyle = "full",
  font = { name: "Inter", size: 14 },
  alternateShading = false,
  showSolution = false,
  solutionCells,
}: GridSvgProps) {
  const cw = size / cols;
  const ch = size / rows;
  const fs = fontStyleToSvg(font);
  const thick = Math.max(1.5, Math.min(cw, ch) * 0.05);
  const thin = Math.max(0.35, Math.min(cw, ch) * 0.018);
  const display = showSolution && solutionCells ? solutionCells : cells;

  const lines: { x1: number; y1: number; x2: number; y2: number; w: number; dash?: string }[] = [];

  if (borderStyle !== "none") {
    for (let i = 0; i <= rows; i++) {
      const isBox = i % boxHeight === 0;
      const w =
        borderStyle === "outer-only" && i > 0 && i < rows
          ? 0
          : borderStyle === "cells-only" && isBox
            ? 0
            : isBox
              ? thick
              : borderStyle === "light"
                ? thin * 0.7
                : thin;
      if (w <= 0) continue;
      lines.push({
        x1: 0,
        y1: i * ch,
        x2: size,
        y2: i * ch,
        w,
        dash: borderStyle === "dotted" && !isBox ? "2 3" : undefined,
      });
    }
    for (let j = 0; j <= cols; j++) {
      const isBox = j % boxWidth === 0;
      const w =
        borderStyle === "outer-only" && j > 0 && j < cols
          ? 0
          : borderStyle === "cells-only" && isBox
            ? 0
            : isBox
              ? thick
              : borderStyle === "light"
                ? thin * 0.7
                : thin;
      if (w <= 0) continue;
      lines.push({
        x1: j * cw,
        y1: 0,
        x2: j * cw,
        y2: size,
        w,
        dash: borderStyle === "dotted" && !isBox ? "2 3" : undefined,
      });
    }
    if (borderStyle === "outer-only" || borderStyle === "full" || borderStyle === "light" || borderStyle === "dotted") {
      lines.push({ x1: 0, y1: 0, x2: size, y2: 0, w: thick });
      lines.push({ x1: 0, y1: size, x2: size, y2: size, w: thick });
      lines.push({ x1: 0, y1: 0, x2: 0, y2: size, w: thick });
      lines.push({ x1: size, y1: 0, x2: size, y2: size, w: thick });
    }
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      {alternateShading &&
        Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) =>
            (r + c) % 2 === 0 ? (
              <rect
                key={`sh-${r}-${c}`}
                x={c * cw}
                y={r * ch}
                width={cw}
                height={ch}
                fill="#f4f4f5"
              />
            ) : null
          )
        )}
      {display.map((row, r) =>
        row.map((cell, c) => {
          const val = cell?.value;
          if (val === null || val === undefined || val === "") return null;
          const cellFont = cell.bold ? { ...font, bold: true } : font;
          const f = fontStyleToSvg(cellFont);
          return (
            <text
              key={`${r}-${c}`}
              x={c * cw + cw / 2}
              y={r * ch + ch / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={f.fontFamily}
              fontSize={rows > 12 ? f.fontSize * 0.55 : rows > 9 ? f.fontSize * 0.75 : f.fontSize}
              fontWeight={f.fontWeight}
              fontStyle={f.fontStyle}
              letterSpacing={f.letterSpacing}
              fill={cell.fill ?? "#000"}
            >
              {String(val)}
            </text>
          );
        })
      )}
      {lines.map((ln, i) => (
        <line
          key={i}
          x1={ln.x1}
          y1={ln.y1}
          x2={ln.x2}
          y2={ln.y2}
          stroke="#000"
          strokeWidth={ln.w}
          strokeDasharray={ln.dash}
        />
      ))}
      {cellFills(cells, rows, cols, cw, ch)}
    </g>
  );
}

function cellFills(
  cells: GridCell[][],
  rows: number,
  cols: number,
  cw: number,
  ch: number
) {
  const out: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const fill = cells[r]?.[c]?.fill;
      if (fill)
        out.push(
          <rect key={`f-${r}-${c}`} x={c * cw} y={r * ch} width={cw} height={ch} fill={fill} />
        );
    }
  }
  return out;
}
