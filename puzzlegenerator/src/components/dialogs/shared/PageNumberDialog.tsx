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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/store/settingsStore";
import type { PageNumberApplyTo, PageNumberPosition } from "@/types/settings.types";
import { useState, useEffect } from "react";

interface PageNumberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PageNumberDialog({ open, onOpenChange }: PageNumberDialogProps) {
  const pageNumbers = useSettingsStore((s) => s.pageNumbers);
  const setPageNumbers = useSettingsStore((s) => s.setPageNumbers);
  const syncToBook = useSettingsStore((s) => s.syncToBook);
  const [local, setLocal] = useState(pageNumbers);

  useEffect(() => {
    if (open) setLocal(pageNumbers);
  }, [open, pageNumbers]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Page Numbers</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Start number</Label>
            <Input
              type="number"
              min={1}
              value={local.startNumber}
              onChange={(e) =>
                setLocal((p) => ({
                  ...p,
                  startNumber: parseInt(e.target.value) || 1,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Position</Label>
            <Select
              value={local.position}
              onValueChange={(v) =>
                setLocal((p) => ({ ...p, position: v as PageNumberPosition }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-center">Bottom center</SelectItem>
                <SelectItem value="bottom-left">Bottom left</SelectItem>
                <SelectItem value="bottom-right">Bottom right</SelectItem>
                <SelectItem value="top-center">Top center</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Apply to</Label>
            <Select
              value={local.applyTo}
              onValueChange={(v) =>
                setLocal((p) => ({ ...p, applyTo: v as PageNumberApplyTo }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All pages</SelectItem>
                <SelectItem value="odd">Odd pages only</SelectItem>
                <SelectItem value="even">Even pages only</SelectItem>
                <SelectItem value="range">Page range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {local.applyTo === "range" && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>From</Label>
                <Input
                  type="number"
                  min={1}
                  value={local.rangeFrom ?? 1}
                  onChange={(e) =>
                    setLocal((p) => ({
                      ...p,
                      rangeFrom: parseInt(e.target.value) || 1,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>To</Label>
                <Input
                  type="number"
                  min={1}
                  value={local.rangeTo ?? 1}
                  onChange={(e) =>
                    setLocal((p) => ({
                      ...p,
                      rangeTo: parseInt(e.target.value) || 1,
                    }))
                  }
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setPageNumbers({ ...local, enabled: true });
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
