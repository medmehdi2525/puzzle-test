"use client";

import { FormattingGroup } from "./FormattingGroup";
import { StencilGroup } from "./StencilGroup";
import { AdjustShapesGroup } from "./AdjustShapesGroup";
import { PuzzlesGroup } from "./PuzzlesGroup";
import { ImageToolsGroup } from "./ImageToolsGroup";
import { ToolbarSeparator } from "./ToolbarGroup";

export function AppToolbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card shadow-sm">
      <div className="flex items-center gap-0 px-2 py-1 overflow-x-auto">
        <div className="shrink-0 pr-3 border-r mr-1">
          <h1 className="text-sm font-bold whitespace-nowrap">
            Bowes Puzzle Generator
          </h1>
          <p className="text-[10px] text-muted-foreground">Web Edition</p>
        </div>
        <FormattingGroup />
        <ToolbarSeparator />
        <StencilGroup />
        <ToolbarSeparator />
        <AdjustShapesGroup />
        <ToolbarSeparator />
        <PuzzlesGroup />
        <ToolbarSeparator />
        <ImageToolsGroup />
      </div>
    </header>
  );
}
