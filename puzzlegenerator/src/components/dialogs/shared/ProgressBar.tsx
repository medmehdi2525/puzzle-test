"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProgressBarProps {
  open: boolean;
  progress: number;
  label?: string;
}

export function ProgressBar({ open, progress, label }: ProgressBarProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Generating…</DialogTitle>
        </DialogHeader>
        {label && <p className="text-sm text-muted-foreground">{label}</p>}
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        <p className="text-right text-xs text-muted-foreground">
          {Math.round(progress)}%
        </p>
      </DialogContent>
    </Dialog>
  );
}
