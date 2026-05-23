# Bowes Puzzle Generator (Web)

Professional puzzle book layout tool — web edition of the Bowes Puzzle Generator PowerPoint add-in.

## Run

```bash
cd puzzlegenerator
npm install
npm run dev
```

## Features

- **27 puzzle types** with settings dialogs, batch generation, and deduplicated variations per book
- **Grid design**: full, light, none, dotted, outer-only, cell dividers; optional checker shading
- **Typography**: per-element fonts with **bold** and **italic**, live preview
- **Export**: PDF/Print (browser), PNG (72–600 DPI), quick export bar
- **Layout**: trim sizes, bleed, gutter, page numbers, zoom, page strip with drag reorder
- **Images**: bulk import/replace, B&W stencil effect

## Variation system

Each page uses a derived seed (`page index + puzzle type + retry attempt`). Batch generation rejects fingerprints that are &gt;92% similar to earlier pages in the same run. Sudoku grids are additionally rotated/mirrored before clue removal.

## Grid borders

Use the **Appearance** panel (right) or set defaults before generating. Applies to Sudoku, Word Search, CalcuDoku, and all grid-based puzzles.

## Export tips

- **PDF / Print**: Export bar → “PDF / Print” — use “Save as PDF” in the system dialog; enable bleed in Formatting first if needed.
- **PNG**: Select page range and DPI; the app briefly visits each page so the SVG is rendered before capture.

## Project structure

| Path | Role |
|------|------|
| `src/engines/registry.ts` | All puzzle generators |
| `src/lib/generateBatch.ts` | Batch + deduplication |
| `src/renderers/PuzzleRenderer.tsx` | SVG rendering |
| `src/lib/puzzleDefinitions.ts` | Dialog fields per puzzle |

## Note

Logic-heavy puzzles (Nurikabe, Shikaku, etc.) use simplified generators suitable for layout and print preview; unique-solution Sudoku uses full validation. For production-only titles, tune `engines/registry.ts` further.
