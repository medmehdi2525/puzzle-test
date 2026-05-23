"use client";

import { useCanvasStore } from "@/store/canvasStore";
import { GutterDialog } from "@/components/dialogs/shared/GutterDialog";
import { FontDialog } from "@/components/dialogs/shared/FontDialog";
import { PageNumberDialog } from "@/components/dialogs/shared/PageNumberDialog";
import { UniversalPuzzleDialog } from "@/components/dialogs/UniversalPuzzleDialog";
import { ExportPngDialog } from "@/components/imagetools/ExportPngDialog";
import { BulkImportDialog } from "@/components/imagetools/BulkImportDialog";
import { BulkReplaceDialog } from "@/components/imagetools/BulkReplaceDialog";
import { PUZZLE_DEFINITIONS } from "@/lib/puzzleDefinitions";
import type { PuzzleType } from "@/types/settings.types";

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
      {PUZZLE_DEFINITIONS.map((d) => (
        <UniversalPuzzleDialog
          key={d.type}
          type={d.type}
          open={isOpen(d.type)}
          onOpenChange={(o) => (o ? openDialogById(d.type) : close())}
        />
      ))}
      <ExportPngDialog open={isOpen("exportPng")} onOpenChange={(o) => !o && close()} />
      <BulkImportDialog open={isOpen("bulkImport")} onOpenChange={(o) => !o && close()} />
      <BulkReplaceDialog open={isOpen("bulkReplace")} onOpenChange={(o) => !o && close()} />
    </>
  );
}
