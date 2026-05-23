import type { GeneratedPuzzle } from "@/types/page.types";
import type { BookSettings } from "@/types/settings.types";
import type { FontStyle, GridBorderStyle } from "@/types/appearance.types";
import { GridSvg, type GridCell } from "./grid.renderer";
import { SudokuSvg } from "./sudoku.renderer";
import type { SudokuPuzzleData, SudokuSolutionData } from "@/types/puzzle.types";
import { fontStyleToSvg } from "@/types/appearance.types";

interface PuzzleRendererProps {
  puzzle: GeneratedPuzzle;
  x: number;
  y: number;
  width: number;
  height: number;
  settings: BookSettings;
  isSolutionPage: boolean;
}

export function PuzzleRenderer({
  puzzle,
  x,
  y,
  width,
  height,
  settings,
  isSolutionPage,
}: PuzzleRendererProps) {
  const data = puzzle.puzzleData as Record<string, unknown>;
  const sol = puzzle.solutionData as Record<string, unknown>;
  const border = (settings.gridBorder ?? "full") as GridBorderStyle;
  const font = settings.fonts.gridNumbers;
  const titleFont = settings.fonts.title;
  const kind = data.kind as string;

  const title = (data.title as string) ?? puzzle.type;
  const titleH = settings.appearance.showTitle ? titleFont.size * 2 : 0;
  const puzzleH = height - titleH;
  const size = Math.min(width, puzzleH);

  if (kind === "sudoku" || puzzle.type === "sudoku") {
    const sd = data as unknown as SudokuPuzzleData;
    const ss = sol as unknown as SudokuSolutionData;
    return (
      <g>
        {renderTitle(x, y, width, title, titleFont)}
        <SudokuSvg
          data={sd.gridSize ? sd : { gridSize: 9, clues: [], useLetters: false }}
          solution={ss}
          x={x + (width - size) / 2}
          y={y + titleH + (puzzleH - size) / 2}
          size={size}
          fontName={font.name}
          fontSize={font.size}
          showSolution={isSolutionPage}
          borderStyle={border}
          fontBold={font.bold}
        />
      </g>
    );
  }

  if (kind === "grid") {
    const rows = data.rows as number;
    const cols = data.cols as number;
    const cells = (isSolutionPage && sol.cells
      ? (sol.cells as GridCell[][])
      : (data.cells as GridCell[][])) ?? [];
    const boxW = (data.boxW as number) ?? (cols === 9 ? 3 : Math.round(Math.sqrt(cols)));
    const px = x + (width - size) / 2;
    const py = y + titleH + (puzzleH - size) / 2;
    return (
      <g>
        {renderTitle(x, y, width, title, titleFont)}
        {renderClues(data, px, py, size, rows, cols, font)}
        <GridSvg
          rows={rows}
          cols={cols}
          cells={cells}
          x={px}
          y={py}
          size={size}
          boxWidth={boxW}
          borderStyle={border}
          font={font}
          alternateShading={settings.appearance.alternateShading}
          showSolution={isSolutionPage}
          solutionCells={sol.cells as GridCell[][] | undefined}
        />
        {renderWordList(data, px, py + size + 8, width, settings.fonts.wordList)}
      </g>
    );
  }

  if (kind === "list") {
    return (
      <g>
        {renderTitle(x, y, width, title, titleFont)}
        {renderList(
          data,
          sol,
          x,
          y + titleH,
          width,
          height - titleH,
          settings.fonts.clueText,
          isSolutionPage
        )}
      </g>
    );
  }

  if (kind === "hangman") {
    const blanks = isSolutionPage
      ? (sol.word as string)
      : (data.blanks as string);
    return (
      <g>
        {renderTitle(x, y, width, "Hangman", titleFont)}
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fontFamily={font.name}
          fontSize={font.size * 2}
          fontWeight={font.bold ? "bold" : "normal"}
          letterSpacing={8}
        >
          {blanks}
        </text>
      </g>
    );
  }

  if (kind === "cryptogram") {
    const text = isSolutionPage
      ? (sol.text as string)
      : (data.encoded as string);
    return (
      <g>
        {renderTitle(x, y, width, "Cryptogram", titleFont)}
        <foreignObject x={x + 20} y={y + titleH} width={width - 40} height={height - titleH}>
          <p
            style={{
              fontFamily: font.name,
              fontSize: font.size,
              fontWeight: font.bold ? 700 : 400,
              lineHeight: 1.6,
              letterSpacing: 2,
            }}
          >
            {text}
          </p>
        </foreignObject>
      </g>
    );
  }

  return null;
}

function renderTitle(
  x: number,
  y: number,
  width: number,
  title: string,
  font: FontStyle
) {
  const f = fontStyleToSvg(font);
  return (
    <text
      x={x + width / 2}
      y={y + font.size + 4}
      textAnchor="middle"
      fontFamily={f.fontFamily}
      fontSize={f.fontSize}
      fontWeight={f.fontWeight}
      fontStyle={f.fontStyle}
      fill="#111"
    >
      {title}
    </text>
  );
}

function renderClues(
  data: Record<string, unknown>,
  px: number,
  py: number,
  size: number,
  rows: number,
  cols: number,
  font: FontStyle
) {
  const clues = data.clues as
    | { top?: number[]; bottom?: number[]; left?: number[]; right?: number[] }
    | undefined;
  const rowClues = data.rowClues as number[] | undefined;
  const colClues = data.colClues as number[] | undefined;
  const f = fontStyleToSvg({ ...font, size: font.size * 0.75 });
  const out: React.ReactNode[] = [];
  const cw = size / cols;
  const ch = size / rows;

  if (clues?.top) {
    clues.top.forEach((n, i) => {
      out.push(
        <text key={`t-${i}`} x={px + i * cw + cw / 2} y={py - 6} textAnchor="middle" fontSize={f.fontSize} fontWeight={f.fontWeight} fill="#333">{n}</text>
      );
    });
  }
  if (clues?.left) {
    clues.left.forEach((n, i) => {
      out.push(
        <text key={`l-${i}`} x={px - 8} y={py + i * ch + ch / 2} textAnchor="end" dominantBaseline="central" fontSize={f.fontSize} fill="#333">{n}</text>
      );
    });
  }
  if (rowClues) {
    rowClues.forEach((n, i) => {
      out.push(
        <text key={`rl-${i}`} x={px - 10} y={py + i * ch + ch / 2} textAnchor="end" dominantBaseline="central" fontSize={f.fontSize} fill="#333">{n}</text>
      );
    });
  }
  if (colClues) {
    colClues.forEach((n, i) => {
      out.push(
        <text key={`cl-${i}`} x={px + i * cw + cw / 2} y={py + size + 14} textAnchor="middle" fontSize={f.fontSize} fill="#333">{n}</text>
      );
    });
  }
  return <g>{out}</g>;
}

function renderWordList(
  data: Record<string, unknown>,
  x: number,
  y: number,
  width: number,
  font: FontStyle
) {
  const words = data.wordList as string[] | undefined;
  if (!words?.length) return null;
  const f = fontStyleToSvg(font);
  return (
    <text x={x} y={y} fontFamily={f.fontFamily} fontSize={f.fontSize} fontWeight={f.fontWeight} fill="#333">
      {words.join("  •  ")}
    </text>
  );
}

function renderList(
  data: Record<string, unknown>,
  sol: Record<string, unknown>,
  x: number,
  y: number,
  width: number,
  height: number,
  font: FontStyle,
  showSolution: boolean
) {
  const items = (data.items as { text?: string; scrambled?: string; display?: string; original?: string }[]) ?? [];
  const f = fontStyleToSvg(font);
  const lineH = font.size * 1.8;
  const cols = width > 400 ? 2 : 1;
  return (
    <g>
      {items.map((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = x + (width / cols) * col + 16;
        const cy = y + row * lineH + font.size;
        let text = item.text ?? item.scrambled ?? item.display ?? "";
        if (showSolution) {
          const solItems = sol.items as typeof items;
          const s = solItems?.[i];
          text = (s as { original?: string })?.original ?? (s as { text?: string })?.text ?? text;
        }
        return (
          <text
            key={i}
            x={cx}
            y={cy}
            fontFamily={f.fontFamily}
            fontSize={f.fontSize}
            fontWeight={f.fontWeight}
            fontStyle={f.fontStyle}
            fill="#111"
          >
            {i + 1}. {text}
          </text>
        );
      })}
    </g>
  );
}
