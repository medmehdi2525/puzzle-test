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
import type { FontSettings } from "@/types/settings.types";
import { useState, useEffect } from "react";

const FONT_KEYS: (keyof FontSettings)[] = [
  "gridNumbers",
  "clueText",
  "wordList",
  "title",
  "pageNumber",
];

const FONT_LABELS: Record<keyof FontSettings, string> = {
  gridNumbers: "Grid numbers",
  clueText: "Clue text",
  wordList: "Word list",
  title: "Title / header",
  pageNumber: "Page numbers",
};

const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Source Sans 3",
  "Merriweather",
  "Libre Baskerville",
  "Courier Prime",
  "JetBrains Mono",
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

  const updateKey = (key: keyof FontSettings, field: "name" | "size", value: string | number) => {
    setLocal((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change Individual Fonts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {FONT_KEYS.map((key) => (
            <div key={key} className="grid grid-cols-2 gap-2 items-end">
              <div className="col-span-2 text-sm font-medium">{FONT_LABELS[key]}</div>
              <div className="space-y-1">
                <Label>Font</Label>
                <Select
                  value={local[key].name}
                  onValueChange={(v) => updateKey(key, "name", v)}
                >
                  <SelectTrigger>
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
                <Label>Size (pt)</Label>
                <Select
                  value={String(local[key].size)}
                  onValueChange={(v) => updateKey(key, "size", parseInt(v))}
                >
                  <SelectTrigger>
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
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
