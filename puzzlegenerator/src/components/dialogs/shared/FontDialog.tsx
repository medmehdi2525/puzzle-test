"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/store/settingsStore";
import { FONT_SIZE_OPTIONS } from "@/types/puzzle.types";
import type { FontSettings, FontStyle } from "@/types/settings.types";
import { useState, useEffect } from "react";

const FONT_KEYS: (keyof FontSettings)[] = [
  "gridNumbers",
  "clueText",
  "wordList",
  "title",
  "pageNumber",
];

const FONT_LABELS: Record<keyof FontSettings, string> = {
  gridNumbers: "Grid / numbers",
  clueText: "Clues",
  wordList: "Word list",
  title: "Title",
  pageNumber: "Page numbers",
};

const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Merriweather",
  "Libre Baskerville",
  "Courier Prime",
  "JetBrains Mono",
  "Georgia",
];

interface FontDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FontDialog({ open, onOpenChange }: FontDialogProps) {
  const fonts = useSettingsStore((s) => s.fonts);
  const setFonts = useSettingsStore((s) => s.setFonts);
  const syncToBook = useSettingsStore((s) => s.syncToBook);
  const [local, setLocal] = useState<FontSettings>(fonts);

  useEffect(() => {
    if (open) setLocal(fonts);
  }, [open, fonts]);

  const updateKey = (
    key: keyof FontSettings,
    patch: Partial<FontStyle>
  ) => {
    setLocal((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fonts & typography</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          {FONT_KEYS.map((key) => (
            <div key={key} className="rounded-lg border p-3 space-y-2 bg-muted/20">
              <div className="text-sm font-medium">{FONT_LABELS[key]}</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Family</Label>
                  <Select
                    value={local[key].name}
                    onValueChange={(v) => updateKey(key, { name: v })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GOOGLE_FONTS.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Size (pt)</Label>
                  <Select
                    value={String(local[key].size)}
                    onValueChange={(v) => updateKey(key, { size: parseInt(v) })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_SIZE_OPTIONS.map((s) => (
                        <SelectItem key={s} value={String(s)}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!local[key].bold}
                    onChange={(e) => updateKey(key, { bold: e.target.checked })}
                  />
                  Bold
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!local[key].italic}
                    onChange={(e) => updateKey(key, { italic: e.target.checked })}
                  />
                  Italic
                </label>
              </div>
              <p
                className="text-sm pt-1 border-t"
                style={{
                  fontFamily: local[key].name,
                  fontSize: local[key].size,
                  fontWeight: local[key].bold ? 700 : 400,
                  fontStyle: local[key].italic ? "italic" : "normal",
                }}
              >
                Preview Aa 123
              </p>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setFonts(local);
              syncToBook();
              onOpenChange(false);
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
