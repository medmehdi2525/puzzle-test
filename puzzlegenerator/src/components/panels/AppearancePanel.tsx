"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookStore } from "@/store/bookStore";
import { GRID_BORDER_LABELS, type GridBorderStyle } from "@/types/appearance.types";

export function AppearancePanel() {
  const gridBorder = useBookStore((s) => s.settings.gridBorder);
  const appearance = useBookStore((s) => s.settings.appearance);
  const updateSettings = useBookStore((s) => s.updateSettings);

  return (
    <aside className="w-52 shrink-0 border-l bg-card p-3 space-y-4 overflow-y-auto">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Grid design
        </h2>
        <div className="space-y-2">
          <Label className="text-xs">Border style</Label>
          <Select
            value={gridBorder}
            onValueChange={(v) =>
              updateSettings({ gridBorder: v as GridBorderStyle })
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(GRID_BORDER_LABELS) as GridBorderStyle[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {GRID_BORDER_LABELS[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <label className="flex items-center gap-2 mt-3 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={appearance.alternateShading}
            onChange={(e) =>
              updateSettings({
                appearance: { ...appearance, alternateShading: e.target.checked },
              })
            }
            className="rounded"
          />
          Alternate cell shading
        </label>
        <label className="flex items-center gap-2 mt-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={appearance.showTitle}
            onChange={(e) =>
              updateSettings({
                appearance: { ...appearance, showTitle: e.target.checked },
              })
            }
            className="rounded"
          />
          Show puzzle title
        </label>
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed">
        Font weight and family are under Formatting → Fonts. Grid style applies to all
        grid-based puzzles on the book.
      </p>
    </aside>
  );
}
