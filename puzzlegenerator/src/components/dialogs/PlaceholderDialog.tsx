"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PlaceholderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  phase?: string;
}

export function PlaceholderDialog({
  open,
  onOpenChange,
  title,
  phase = "Upcoming phase",
}: PlaceholderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This puzzle type will be implemented in a future phase ({phase}).
          Sudoku is fully functional — use it to test the canvas and page flow.
        </p>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
