"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBookStore } from "@/store/bookStore";

interface BulkReplaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkReplaceDialog({ open, onOpenChange }: BulkReplaceDialogProps) {
  const pages = useBookStore((s) => s.pages);
  const updatePage = useBookStore((s) => s.updatePage);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files);
    let fi = 0;
    pages.forEach((page) => {
      page.elements.forEach((el) => {
        if (el.kind === "image" && list[fi]) {
          const url = URL.createObjectURL(list[fi]);
          fi++;
          updatePage(page.id, (p) => ({
            ...p,
            elements: p.elements.map((e) =>
              e.id === el.id ? { ...e, imageSrc: url } : e
            ),
          }));
        }
      });
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk replace images</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Images replace existing page images in order (by page, then element).
        </p>
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
          <Button onClick={() => inputRef.current?.click()}>Choose folder/files</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
