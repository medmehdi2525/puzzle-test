"use client";

import { useCanvasStore } from "@/store/canvasStore";
import { GutterDialog } from "@/components/dialogs/shared/GutterDialog";
import { FontDialog } from "@/components/dialogs/shared/FontDialog";
import { PageNumberDialog } from "@/components/dialogs/shared/PageNumberDialog";
import { SudokuDialog } from "@/components/dialogs/SudokuDialog";
import { PlaceholderDialog } from "@/components/dialogs/PlaceholderDialog";
import { PUZZLE_BUTTONS } from "@/lib/puzzleConfig";

export function DialogHost() {
  const openDialog = useCanvasStore((s) => s.openDialog);
  const openDialogById = useCanvasStore((s) => s.openDialogById);

  const isOpen = (id: string) => openDialog === id;
  const close = () => openDialogById(null);

  return (
    <>
      <GutterDialog
        open={isOpen("gutter")}
        onOpenChange={(o) => (o ? openDialogById("gutter") : close())}
      />
      <FontDialog
        open={isOpen("fonts")}
        onOpenChange={(o) => (o ? openDialogById("fonts") : close())}
      />
      <PageNumberDialog
        open={isOpen("pageNumbers")}
        onOpenChange={(o) => (o ? openDialogById("pageNumbers") : close())}
      />
      <SudokuDialog
        open={isOpen("sudoku")}
        onOpenChange={(o) => (o ? openDialogById("sudoku") : close())}
      />
      {PUZZLE_BUTTONS.filter((p) => !p.implemented).map((p) => (
        <PlaceholderDialog
          key={p.dialogId}
          open={isOpen(p.dialogId)}
          onOpenChange={(o) => !o && close()}
          title={p.label}
        />
      ))}
      <PlaceholderDialog
        open={isOpen("exportPng")}
        onOpenChange={(o) => !o && close()}
        title="Export Slides as PNG"
        phase="Phase 5"
      />
      <PlaceholderDialog
        open={isOpen("bulkImport")}
        onOpenChange={(o) => !o && close()}
        title="Bulk Import Images"
        phase="Phase 5"
      />
      <PlaceholderDialog
        open={isOpen("bulkReplace")}
        onOpenChange={(o) => !o && close()}
        title="Bulk Replace Images"
        phase="Phase 5"
      />
    </>
  );
}
