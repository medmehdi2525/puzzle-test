"use client";

import { Button } from "@/components/ui/button";
import { ToolbarGroup } from "./ToolbarGroup";
import { PUZZLE_BUTTONS } from "@/lib/puzzleConfig";
import { useCanvasStore } from "@/store/canvasStore";

export function PuzzlesGroup() {
  const openDialog = useCanvasStore((s) => s.openDialogById);

  return (
    <ToolbarGroup title="Puzzles">
      <div className="flex flex-wrap gap-0.5 max-w-[640px]">
        {PUZZLE_BUTTONS.map((p) => (
          <Button
            key={p.type}
            variant="outline"
            size="sm"
            className="text-[11px] h-7 px-2 hover:bg-primary hover:text-primary-foreground"
            onClick={() => openDialog(p.type)}
          >
            {p.label}
          </Button>
        ))}
      </div>
    </ToolbarGroup>
  );
}
