"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileImage, Printer, FileText } from "lucide-react";
import { useBookStore } from "@/store/bookStore";
import { exportPagesAsPng, printCurrentPage } from "@/lib/export/pngExport";
import { exportBookViaPrint } from "@/lib/export/pdfExport";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ExportBar() {
  const pages = useBookStore((s) => s.pages);
  const settings = useBookStore((s) => s.settings);
  const [pngOpen, setPngOpen] = useState(false);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(pages.length);
  const [dpi, setDpi] = useState("300");
  const [prefix, setPrefix] = useState("puzzle");
  const [exporting, setExporting] = useState(false);

  const handlePng = async () => {
    setExporting(true);
    try {
      await exportPagesAsPng(pages, settings, {
        from,
        to,
        dpi: parseInt(dpi),
        prefix,
      });
      setPngOpen(false);
    } catch {
      alert("Export failed. Open each page briefly or export from print view.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-bar flex items-center gap-2 px-3 py-2 border-b bg-gradient-to-r from-slate-50 to-white">
      <span className="text-xs font-semibold text-muted-foreground mr-1">Export</span>
      <Button size="sm" variant="default" className="h-8 gap-1" onClick={() => exportBookViaPrint()}>
        <FileText className="h-3.5 w-3.5" />
        PDF / Print
      </Button>
      <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => printCurrentPage()}>
        <Printer className="h-3.5 w-3.5" />
        Print page
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1"
        onClick={() => {
          setTo(pages.length);
          setPngOpen(true);
        }}
      >
        <FileImage className="h-3.5 w-3.5" />
        PNG
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="h-8 gap-1 ml-auto"
        onClick={() => exportBookViaPrint()}
      >
        <Download className="h-3.5 w-3.5" />
        Quick export
      </Button>

      <Dialog open={pngOpen} onOpenChange={setPngOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Export as PNG</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>From page</Label>
                <Input type="number" min={1} value={from} onChange={(e) => setFrom(parseInt(e.target.value) || 1)} />
              </div>
              <div className="space-y-1">
                <Label>To page</Label>
                <Input type="number" min={1} value={to} onChange={(e) => setTo(parseInt(e.target.value) || 1)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>DPI</Label>
              <Select value={dpi} onValueChange={setDpi}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["72", "150", "300", "600"].map((d) => (
                    <SelectItem key={d} value={d}>{d} DPI</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Filename prefix</Label>
              <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPngOpen(false)}>Cancel</Button>
            <Button onClick={handlePng} disabled={exporting}>
              {exporting ? "Exporting…" : "Download PNGs"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
