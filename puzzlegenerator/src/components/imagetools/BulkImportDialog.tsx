"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBookStore } from "@/store/bookStore";
import { generateId } from "@/lib/utils";
import { inchesToPx } from "@/lib/trimSizes";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkImportDialog({ open, onOpenChange }: BulkImportDialogProps) {
  const insertPagesAt = useBookStore((s) => s.insertPagesAt);
  const pages = useBookStore((s) => s.pages);
  const settings = useBookStore((s) => s.settings);
  const inputRef = useRef<HTMLInputElement>(null);
  const [gridMode, setGridMode] = useState(false);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const margin = inchesToPx(settings.marginTop);
    const newPages = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      return {
        id: generateId(),
        pageType: "blank" as const,
        puzzles: [],
        layout: "1" as const,
        elements: [
          {
            id: generateId(),
            kind: "image" as const,
            x: margin,
            y: margin,
            width: 400,
            height: 400,
            zIndex: 1,
            imageSrc: url,
          },
        ],
      };
    });
    insertPagesAt(pages.length, newPages);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk import images</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Each image is placed on a new page, fitted inside margins.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={gridMode} onChange={(e) => setGridMode(e.target.checked)} />
          2×2 grid per page (first 4 images only per batch)
        </label>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => inputRef.current?.click()}>Choose images</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
