"use client";

import { FormattingGroup } from "./FormattingGroup";
import { StencilGroup } from "./StencilGroup";
import { AdjustShapesGroup } from "./AdjustShapesGroup";
import { PuzzlesGroup } from "./PuzzlesGroup";
import { ImageToolsGroup } from "./ImageToolsGroup";
import { ToolbarSeparator } from "./ToolbarGroup";

export function AppToolbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur shadow-sm">
      <div className="flex items-center gap-0 px-3 py-2 overflow-x-auto">
        <div className="shrink-0 pr-4 border-r mr-2">
          <h1 className="text-base font-bold whitespace-nowrap tracking-tight text-primary">
            Bowes Puzzle Generator
          </h1>
          <p className="text-[10px] text-muted-foreground">Professional puzzle books</p>
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
