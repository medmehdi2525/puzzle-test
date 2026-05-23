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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export interface BaseDialogFields {
  pages: number;
  margins: number;
  startPage: number;
}

interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: BaseDialogFields;
  onFieldsChange: (fields: Partial<BaseDialogFields>) => void;
  onConfirm: () => void;
  children?: React.ReactNode;
}

export function BaseDialog({
  open,
  onOpenChange,
  title,
  fields,
  onFieldsChange,
  onConfirm,
  children,
}: BaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="pages">Pages</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-muted-foreground">
                        <HelpCircle className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Number of puzzle pages to generate in this batch
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="pages"
                type="number"
                min={1}
                max={500}
                value={fields.pages}
                onChange={(e) =>
                  onFieldsChange({ pages: Math.max(1, parseInt(e.target.value) || 1) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startPage">Start Page</Label>
              <Input
                id="startPage"
                type="number"
                min={1}
                value={fields.startPage}
                onChange={(e) =>
                  onFieldsChange({
                    startPage: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="margins">Margins (inches)</Label>
            <Input
              id="margins"
              type="number"
              step={0.05}
              min={0}
              value={fields.margins}
              onChange={(e) =>
                onFieldsChange({
                  margins: Math.max(0, parseFloat(e.target.value) || 0),
                })
              }
            />
          </div>
          {children}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
