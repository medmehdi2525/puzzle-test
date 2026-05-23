"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolbarGroup } from "./ToolbarGroup";
import { useCanvasStore } from "@/store/canvasStore";
import { useBookStore } from "@/store/bookStore";
import { inchesToPx, PREVIEW_DPI } from "@/lib/trimSizes";

export function AdjustShapesGroup() {
  const nudgeDistance = useCanvasStore((s) => s.nudgeDistance);
  const resizePercent = useCanvasStore((s) => s.resizePercent);
  const selectedElementId = useCanvasStore((s) => s.selectedElementId);
  const setNudgeDistance = useCanvasStore((s) => s.setNudgeDistance);
  const setResizePercent = useCanvasStore((s) => s.setResizePercent);
  const updatePage = useBookStore((s) => s.updatePage);
  const getCurrentPage = useBookStore((s) => s.getCurrentPage);

  const nudge = (dx: number, dy: number) => {
    const page = getCurrentPage();
    if (!page || !selectedElementId) return;
    const delta = inchesToPx(nudgeDistance, PREVIEW_DPI);
    updatePage(page.id, (p) => ({
      ...p,
      elements: p.elements.map((el) =>
        el.id === selectedElementId
          ? { ...el, x: el.x + dx * delta, y: el.y + dy * delta }
          : el
      ),
    }));
  };

  const applyResize = (all: boolean) => {
    const page = getCurrentPage();
    if (!page) return;
    const factor = resizePercent / 100;
    updatePage(page.id, (p) => ({
      ...p,
      elements: p.elements.map((el) => {
        if (!all && el.id !== selectedElementId) return el;
        if (!all && !selectedElementId) return el;
        return {
          ...el,
          width: el.width * factor,
          height: el.height * factor,
        };
      }),
    }));
  };

  return (
    <ToolbarGroup title="Adjust Shapes">
      <Input
        className="w-14 h-8 text-xs"
        type="number"
        step={0.05}
        value={nudgeDistance}
        onChange={(e) => setNudgeDistance(parseFloat(e.target.value) || 0.1)}
        title="Distance (inches)"
      />
      <Button variant="outline" size="sm" onClick={() => nudge(0, -1)}>
        Up
      </Button>
      <Button variant="outline" size="sm" onClick={() => nudge(0, 1)}>
        Down
      </Button>
      <Button variant="outline" size="sm" onClick={() => nudge(-1, 0)}>
        Left
      </Button>
      <Button variant="outline" size="sm" onClick={() => nudge(1, 0)}>
        Right
      </Button>
      <Input
        className="w-14 h-8 text-xs"
        type="number"
        value={resizePercent}
        onChange={(e) => setResizePercent(parseFloat(e.target.value) || 100)}
        title="Percent"
      />
      <Button variant="outline" size="sm" onClick={() => applyResize(false)}>
        Apply
      </Button>
      <Button variant="outline" size="sm" onClick={() => applyResize(true)}>
        Adjust All
      </Button>
    </ToolbarGroup>
  );
}
