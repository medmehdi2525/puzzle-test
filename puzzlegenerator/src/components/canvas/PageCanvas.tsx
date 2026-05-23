"use client";

import { useMemo } from "react";
import { useBookStore } from "@/store/bookStore";
import { useCanvasStore } from "@/store/canvasStore";
import { getPageDimensions, inchesToPx } from "@/lib/trimSizes";
import { BleedOverlay } from "./BleedOverlay";
import { SudokuSvg } from "@/renderers/sudoku.renderer";
import type { GeneratedPuzzle } from "@/types/page.types";
import type { SudokuPuzzleData, SudokuSolutionData } from "@/types/puzzle.types";

function renderPuzzle(
  puzzle: GeneratedPuzzle,
  x: number,
  y: number,
  size: number,
  fonts: { gridNumbers: { name: string; size: number } },
  isSolutionPage: boolean
) {
  if (puzzle.type === "sudoku") {
    const data = puzzle.puzzleData as SudokuPuzzleData;
    const sol = puzzle.solutionData as SudokuSolutionData;
    return (
      <SudokuSvg
        key={puzzle.id}
        data={data}
        solution={sol}
        x={x}
        y={y}
        size={size}
        fontName={fonts.gridNumbers.name}
        fontSize={fonts.gridNumbers.size}
        showSolution={isSolutionPage}
      />
    );
  }
  return null;
}

export function PageCanvas() {
  const settings = useBookStore((s) => s.settings);
  const page = useBookStore((s) => s.getCurrentPage());
  const pageIndex = useBookStore((s) => {
    const p = s.getCurrentPage();
    return s.pages.findIndex((pg) => pg.id === p?.id);
  });
  const zoom = useCanvasStore((s) => s.zoom);

  const dims = useMemo(
    () =>
      getPageDimensions(
        settings.trim,
        settings.bleedEnabled,
        settings.bleedSize
      ),
    [settings.trim, settings.bleedEnabled, settings.bleedSize]
  );

  if (!page) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        No page selected
      </div>
    );
  }

  const marginPx = inchesToPx(settings.marginTop);
  const bleedPx = settings.bleedEnabled ? inchesToPx(settings.bleedSize) : 0;
  const isOdd = (pageIndex + 1) % 2 === 1;
  const gutterPx = inchesToPx(
    isOdd ? settings.gutterSize : 0
  );
  const gutterRightPx = inchesToPx(
    !isOdd ? settings.gutterSize : 0
  );

  const contentWidth =
    dims.trimWidthPx - marginPx * 2 - gutterPx - gutterRightPx;
  const contentHeight = dims.trimHeightPx - marginPx * 2;
  const puzzleSize = Math.min(contentWidth, contentHeight * 0.85);
  const puzzleX = bleedPx + marginPx + gutterPx + (contentWidth - puzzleSize) / 2;
  const puzzleY = bleedPx + marginPx + (contentHeight - puzzleSize) / 2;

  const scale = zoom;
  const displayW = dims.widthPx * scale;
  const displayH = dims.heightPx * scale;

  return (
    <div className="flex flex-1 items-center justify-center overflow-auto bg-muted/40 p-8">
      <div
        className="shadow-lg bg-white"
        style={{ width: displayW, height: displayH }}
      >
        <svg
          width={displayW}
          height={displayH}
          viewBox={`0 0 ${dims.widthPx} ${dims.heightPx}`}
          className="block"
        >
          <rect width={dims.widthPx} height={dims.heightPx} fill="#fff" />
          {settings.bleedEnabled && (
            <BleedOverlay
              bleedSizeIn={settings.bleedSize}
              trimWidthPx={dims.trimWidthPx}
              trimHeightPx={dims.trimHeightPx}
            />
          )}
          {page.puzzles.map((puzzle) =>
            renderPuzzle(
              puzzle,
              puzzleX,
              puzzleY,
              puzzleSize,
              settings.fonts,
              page.pageType === "solution"
            )
          )}
          {page.pageType === "divider" && page.title && (
            <text
              x={dims.widthPx / 2}
              y={dims.heightPx / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={settings.fonts.title.name}
              fontSize={settings.fonts.title.size * 1.5}
              fill="#000"
            >
              {page.title}
            </text>
          )}
          {settings.pageNumbers.enabled && (
            <PageNumberOverlay
              pageIndex={pageIndex}
              settings={settings}
              width={dims.widthPx}
              height={dims.heightPx}
            />
          )}
        </svg>
      </div>
    </div>
  );
}

function PageNumberOverlay({
  pageIndex,
  settings,
  width,
  height,
}: {
  pageIndex: number;
  settings: ReturnType<typeof useBookStore.getState>["settings"];
  width: number;
  height: number;
}) {
  const num = settings.pageNumbers.startNumber + pageIndex;
  const pos = settings.pageNumbers.position;
  const margin = inchesToPx(0.35);
  let x = width / 2;
  let y = height - margin;
  let anchor: "middle" | "start" | "end" = "middle";

  if (pos === "bottom-left") {
    x = margin;
    anchor = "start";
  } else if (pos === "bottom-right") {
    x = width - margin;
    anchor = "end";
  } else if (pos === "top-center") {
    y = margin;
  }

  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline={pos.startsWith("top") ? "hanging" : "auto"}
      fontFamily={settings.fonts.pageNumber.name}
      fontSize={settings.fonts.pageNumber.size}
      fill="#333"
    >
      {num}
    </text>
  );
}
