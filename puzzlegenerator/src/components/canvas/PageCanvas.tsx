"use client";

import { useMemo } from "react";
import { useBookStore } from "@/store/bookStore";
import { useCanvasStore } from "@/store/canvasStore";
import { getPageDimensions, inchesToPx } from "@/lib/trimSizes";
import { BleedOverlay } from "./BleedOverlay";
import { PuzzleRenderer } from "@/renderers/PuzzleRenderer";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

export function PageCanvas() {
  const settings = useBookStore((s) => s.settings);
  const page = useBookStore((s) => s.getCurrentPage());
  const pageIndex = useBookStore((s) => {
    const p = s.getCurrentPage();
    return s.pages.findIndex((pg) => pg.id === p?.id);
  });
  const zoom = useCanvasStore((s) => s.zoom);
  const setZoom = useCanvasStore((s) => s.setZoom);

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
  const gutterPx = inchesToPx(isOdd ? settings.gutterSize : 0);
  const gutterRightPx = inchesToPx(!isOdd ? settings.gutterSize : 0);

  const contentWidth =
    dims.trimWidthPx - marginPx * 2 - gutterPx - gutterRightPx;
  const contentHeight = dims.trimHeightPx - marginPx * 2;
  const puzzleW = contentWidth;
  const puzzleH = contentHeight * 0.88;
  const puzzleX = bleedPx + marginPx + gutterPx;
  const puzzleY = bleedPx + marginPx + (contentHeight - puzzleH) / 2;

  const scale = zoom;
  const displayW = dims.widthPx * scale;
  const displayH = dims.heightPx * scale;

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex items-center justify-center gap-2 py-2 border-b bg-muted/30">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-auto bg-[radial-gradient(circle_at_50%_50%,#e8ecf1_0%,#d1d9e6_100%)] p-8 print:p-0 print:bg-white">
        <div
          className="shadow-2xl bg-white ring-1 ring-black/5 print:shadow-none print:ring-0"
          style={{ width: displayW, height: displayH }}
        >
          <svg
            id={`page-svg-${page.id}`}
            width={displayW}
            height={displayH}
            viewBox={`0 0 ${dims.widthPx} ${dims.heightPx}`}
            className="block print-page"
          >
            <rect width={dims.widthPx} height={dims.heightPx} fill="#fff" />
            {settings.bleedEnabled && (
              <BleedOverlay
                bleedSizeIn={settings.bleedSize}
                trimWidthPx={dims.trimWidthPx}
                trimHeightPx={dims.trimHeightPx}
              />
            )}
            {page.puzzles.map((puzzle) => (
              <PuzzleRenderer
                key={puzzle.id}
                puzzle={puzzle}
                x={puzzleX}
                y={puzzleY}
                width={puzzleW}
                height={puzzleH}
                settings={settings}
                isSolutionPage={page.pageType === "solution"}
              />
            ))}
            {page.elements
              .filter((e) => e.kind === "image" && e.imageSrc)
              .map((el) => (
                <image
                  key={el.id}
                  href={el.imageSrc}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  preserveAspectRatio="xMidYMid meet"
                />
              ))}
            {page.pageType === "divider" && page.title && (
              <text
                x={dims.widthPx / 2}
                y={dims.heightPx / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily={settings.fonts.title.name}
                fontSize={settings.fonts.title.size * 1.5}
                fontWeight={settings.fonts.title.bold ? "bold" : "normal"}
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
      fontWeight={settings.fonts.pageNumber.bold ? "bold" : "normal"}
      fill="#333"
    >
      {num}
    </text>
  );
}
