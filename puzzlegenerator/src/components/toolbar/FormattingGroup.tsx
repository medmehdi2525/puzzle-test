"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolbarGroup } from "./ToolbarGroup";
import { useBookStore } from "@/store/bookStore";
import { useCanvasStore } from "@/store/canvasStore";
import { TRIM_SIZE_LIST } from "@/lib/trimSizes";
import type { TrimSize } from "@/types/settings.types";

export function FormattingGroup() {
  const trim = useBookStore((s) => s.settings.trim);
  const bleedEnabled = useBookStore((s) => s.settings.bleedEnabled);
  const setTrim = useBookStore((s) => s.setTrim);
  const toggleBleed = useBookStore((s) => s.toggleBleed);
  const openDialog = useCanvasStore((s) => s.openDialogById);

  return (
    <ToolbarGroup title="Formatting">
      <Select value={trim} onValueChange={(v) => setTrim(v as TrimSize)}>
        <SelectTrigger className="w-[130px] h-8 text-xs">
          <SelectValue placeholder="Trim size" />
        </SelectTrigger>
        <SelectContent>
          {TRIM_SIZE_LIST.map(([key, dim]) => (
            <SelectItem key={key} value={key}>
              {dim.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant={bleedEnabled ? "default" : "outline"}
        size="sm"
        onClick={toggleBleed}
        title="Add/remove 0.125&quot; bleed"
      >
        {bleedEnabled ? "Bleed On" : "Add Bleed"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openDialog("gutter")}
      >
        Gutter
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openDialog("fonts")}
      >
        Fonts
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openDialog("pageNumbers")}
      >
        Page #
      </Button>
    </ToolbarGroup>
  );
}
