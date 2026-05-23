# Bowes Puzzle Generator (Web)

Browser-based clone of the **Bowes Puzzle Generator** PowerPoint add-in for print-ready puzzle book pages.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn-style UI (Radix)
- Zustand state
- SVG canvas preview
- `@react-pdf/renderer` (Phase 6 — PDF export stub in place)

## Getting started

```bash
cd puzzlegenerator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Current status

### Phase 1 — Shell (done)

- Sticky 5-group toolbar (Formatting, Stencil, Adjust Shapes, Puzzles, Image Tools)
- All 16 trim sizes + bleed toggle with red trim guide
- Gutter, fonts, and page number dialogs
- Left page strip with add/delete/reorder (drag-and-drop)
- SVG page canvas with margins and gutter (odd/even)

### Phase 2 — In progress

- **Sudoku**: full generator (unique solution, difficulty clues), settings dialog, SVG render, batch pages + separate solution pages
- Word Search, Crossword: placeholders (dialogs show “coming soon”)

### Phases 3–6

Remaining 26 puzzle types, stencil/image tools, shape selection handles, Web Workers for batch generation, and vector PDF export are planned per the implementation order in the product spec.

## Project layout

See `src/` — `engines/` (generators), `renderers/` (SVG), `store/` (Zustand), `components/toolbar/` and `components/dialogs/`.

## Try Sudoku

1. Click **Sudoku** in the Puzzles group.
2. Set pages, difficulty, grid size, and solution mode.
3. Confirm generation — pages appear in the left strip; select any to preview.
