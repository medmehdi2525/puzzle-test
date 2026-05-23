"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBookStore } from "@/store/bookStore";
import { useState, useEffect } from "react";

interface GutterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GutterDialog({ open, onOpenChange }: GutterDialogProps) {
  const gutterSize = useBookStore((s) => s.settings.gutterSize);
  const setGutterSize = useBookStore((s) => s.setGutterSize);
  const [value, setValue] = useState(gutterSize);

  useEffect(() => {
    if (open) setValue(gutterSize);
  }, [open, gutterSize]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Set Gutter Size</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Gutter is added to the inner margin (left on odd pages, right on even
          pages) for perfect-bound books.
        </p>
        <div className="space-y-2">
          <Label htmlFor="gutter">Gutter (inches)</Label>
          <Input
            id="gutter"
            type="number"
            step={0.05}
            min={0}
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setGutterSize(value);
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
