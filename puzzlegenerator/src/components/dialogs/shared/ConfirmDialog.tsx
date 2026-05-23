"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  puzzleName: string;
  pageCount: number;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  puzzleName,
  pageCount,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm Generation</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Generate <strong>{pageCount}</strong> page{pageCount !== 1 ? "s" : ""} of{" "}
          <strong>{puzzleName}</strong>? Existing content on target pages may be
          replaced.
        </p>
        <p className="text-sm">Are you sure?</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Yes, Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
