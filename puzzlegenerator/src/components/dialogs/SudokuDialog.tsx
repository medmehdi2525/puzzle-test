"use client";

import { useState } from "react";
import { BaseDialog, type BaseDialogFields } from "./shared/BaseDialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  SudokuDifficulty,
  SudokuGridSize,
  SudokuSettings,
  SudokuSolutionMode,
} from "@/types/puzzle.types";
import { useBookStore } from "@/store/bookStore";
import { useSettingsStore } from "@/store/settingsStore";
import { buildSudokuPages } from "@/lib/puzzleGeneration";
import { useCanvasStore } from "@/store/canvasStore";
import { ConfirmDialog } from "./shared/ConfirmDialog";
import { ProgressBar } from "./shared/ProgressBar";

interface SudokuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SudokuDialog({ open, onOpenChange }: SudokuDialogProps) {
  const fonts = useSettingsStore((s) => s.fonts);
  const insertPagesAt = useBookStore((s) => s.insertPagesAt);
  const pages = useBookStore((s) => s.pages);
  const setMargins = useBookStore((s) => s.setMargins);
  const setProgress = useCanvasStore((s) => s.setProgress);

  const [base, setBase] = useState<BaseDialogFields>({
    pages: 1,
    margins: 0.5,
    startPage: 1,
  });
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>("medium");
  const [gridSize, setGridSize] = useState<SudokuGridSize>(9);
  const [showSolution, setShowSolution] = useState<SudokuSolutionMode>("separate");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const runGeneration = async () => {
    const settings: SudokuSettings = {
      pages: base.pages,
      difficulty,
      gridSize,
      fontName: fonts.gridNumbers.name,
      fontSize: fonts.gridNumbers.size,
      margins: base.margins,
      startPage: base.startPage,
      showSolution,
    };

    setMargins(base.margins);
    const showBar = base.pages > 3;
    if (showBar) setProgress(true, 0, "Generating Sudoku…");

    const startIndex = Math.min(
      Math.max(0, base.startPage - 1),
      pages.length
    );
    const baseSeed = Date.now();

    try {
      const { puzzlePages, solutionPages } = buildSudokuPages(settings, baseSeed);
      const allPages = [...puzzlePages];
      if (showSolution === "separate") {
        allPages.push(...solutionPages);
      }

      if (showBar) {
        for (let i = 0; i <= allPages.length; i++) {
          setProgress(true, (i / allPages.length) * 100, `Page ${i} of ${allPages.length}`);
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      insertPagesAt(startIndex, allPages);
      onOpenChange(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setProgress(false);
    }
  };

  return (
    <>
      <BaseDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Sudoku"
        fields={base}
        onFieldsChange={(p) => setBase((b) => ({ ...b, ...p }))}
        onConfirm={() => setConfirmOpen(true)}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={(v) => setDifficulty(v as SudokuDifficulty)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Grid size</Label>
            <Select
              value={String(gridSize)}
              onValueChange={(v) => setGridSize(parseInt(v) as SudokuGridSize)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4×4 (Kids)</SelectItem>
                <SelectItem value="9">9×9 (Standard)</SelectItem>
                <SelectItem value="16">16×16 (Expert)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Show solution</Label>
          <Select
            value={showSolution}
            onValueChange={(v) => setShowSolution(v as SudokuSolutionMode)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">On same page</SelectItem>
              <SelectItem value="separate">Separate page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </BaseDialog>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        puzzleName="Sudoku"
        pageCount={base.pages}
        onConfirm={runGeneration}
      />
      <ProgressWatcher />
    </>
  );
}

function ProgressWatcher() {
  const show = useCanvasStore((s) => s.showProgress);
  const progress = useCanvasStore((s) => s.progress);
  const label = useCanvasStore((s) => s.progressLabel);
  return <ProgressBar open={show} progress={progress} label={label} />;
}
