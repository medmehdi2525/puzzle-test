"use client";

import { Button } from "@/components/ui/button";
import { ToolbarGroup } from "./ToolbarGroup";
import { PUZZLE_BUTTONS } from "@/lib/puzzleConfig";
import { useCanvasStore } from "@/store/canvasStore";

export function PuzzlesGroup() {
  const openDialog = useCanvasStore((s) => s.openDialogById);

  return (
    <ToolbarGroup title="Puzzles">
      {PUZZLE_BUTTONS.map((p) => (
        <Button
          key={p.type}
          variant={p.implemented ? "outline" : "ghost"}
          size="sm"
          className="text-xs h-7 px-2"
          onClick={() => openDialog(p.dialogId)}
          title={p.implemented ? p.label : `${p.label} (coming soon)`}
        >
          {p.label}
        </Button>
      ))}
    </ToolbarGroup>
  );
}
