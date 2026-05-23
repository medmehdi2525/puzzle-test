"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookStore } from "@/store/bookStore";
import { exportPagesAsPng } from "@/lib/export/pngExport";

interface ExportPngDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportPngDialog({ open, onOpenChange }: ExportPngDialogProps) {
  const pages = useBookStore((s) => s.pages);
  const settings = useBookStore((s) => s.settings);
  const setCurrentPage = useBookStore((s) => s.setCurrentPage);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(pages.length);
  const [dpi, setDpi] = useState("300");
  const [prefix, setPrefix] = useState("puzzle");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      for (let i = from - 1; i < to && i < pages.length; i++) {
        setCurrentPage(pages[i].id);
        await new Promise((r) => setTimeout(r, 150));
      }
      await exportPagesAsPng(pages, settings, {
        from,
        to,
        dpi: parseInt(dpi),
        prefix,
      });
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Export slides as PNG</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>From</Label>
              <Input type="number" min={1} value={from} onChange={(e) => setFrom(+e.target.value || 1)} />
            </div>
            <div className="space-y-1">
              <Label>To</Label>
              <Input type="number" min={1} value={to} onChange={(e) => setTo(+e.target.value || 1)} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>DPI</Label>
            <Select value={dpi} onValueChange={setDpi}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["72", "150", "300", "600"].map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Prefix</Label>
            <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={run} disabled={busy}>{busy ? "Exporting…" : "Export"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
