"use client";

import { Button } from "@/components/ui/button";
import { ToolbarGroup } from "./ToolbarGroup";
import { useCanvasStore } from "@/store/canvasStore";

export function ImageToolsGroup() {
  const openDialog = useCanvasStore((s) => s.openDialogById);

  return (
    <ToolbarGroup title="Image Tools">
      <Button
        variant="outline"
        size="sm"
        onClick={() => openDialog("exportPng")}
      >
        Export PNG
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openDialog("bulkImport")}
      >
        Bulk Import
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openDialog("bulkReplace")}
      >
        Bulk Replace
      </Button>
    </ToolbarGroup>
  );
}
