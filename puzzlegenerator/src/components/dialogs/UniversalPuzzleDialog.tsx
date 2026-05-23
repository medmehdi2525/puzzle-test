"use client";

import { useState, useEffect } from "react";
import { BaseDialog, type BaseDialogFields } from "./shared/BaseDialog";
import { ConfirmDialog } from "./shared/ConfirmDialog";
import { ProgressBar } from "./shared/ProgressBar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPuzzleDefinition,
  coerceSettings,
  type PuzzleFieldDef,
} from "@/lib/puzzleDefinitions";
import type { PuzzleType } from "@/types/settings.types";
import { generatePuzzleBatch } from "@/lib/generateBatch";
import { useBookStore } from "@/store/bookStore";
import { useCanvasStore } from "@/store/canvasStore";
import { batchBaseSeed } from "@/lib/seed";

interface UniversalPuzzleDialogProps {
  type: PuzzleType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UniversalPuzzleDialog({
  type,
  open,
  onOpenChange,
}: UniversalPuzzleDialogProps) {
  const def = getPuzzleDefinition(type);
  const insertPagesAt = useBookStore((s) => s.insertPagesAt);
  const pages = useBookStore((s) => s.pages);
  const setMargins = useBookStore((s) => s.setMargins);
  const setProgress = useCanvasStore((s) => s.setProgress);
  const showProgress = useCanvasStore((s) => s.showProgress);
  const progress = useCanvasStore((s) => s.progress);
  const progressLabel = useCanvasStore((s) => s.progressLabel);

  const [base, setBase] = useState<BaseDialogFields>({
    pages: 1,
    margins: 0.5,
    startPage: 1,
  });
  const [fields, setFields] = useState<Record<string, unknown>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open && def) {
      const init: Record<string, unknown> = {};
      for (const f of def.fields) init[f.key] = f.default;
      setFields(init);
    }
  }, [open, def, type]);

  if (!def) return null;

  const runGeneration = async () => {
    const raw = { ...base, ...fields };
    const settings = coerceSettings(def, raw);
    const showSolution = (fields.showSolution as "yes" | "no" | "separate") ?? "separate";
    setMargins(base.margins);

    const showBar = base.pages > 3;
    if (showBar) setProgress(true, 0, `Generating ${def.label}…`);

    const startIndex = Math.min(Math.max(0, base.startPage - 1), pages.length);

    try {
      const { puzzlePages, solutionPages } = generatePuzzleBatch({
        type,
        settings,
        baseSeed: batchBaseSeed(),
        showSolution,
      });

      const all =
        showSolution === "separate"
          ? [...puzzlePages, ...solutionPages]
          : puzzlePages;

      if (showBar) {
        for (let i = 0; i <= all.length; i++) {
          setProgress(true, (i / all.length) * 100, `Page ${i} of ${all.length}`);
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      insertPagesAt(startIndex, all);
      onOpenChange(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setProgress(false);
    }
  };

  return (
    <>
      <BaseDialog
        open={open}
        onOpenChange={onOpenChange}
        title={def.label}
        fields={base}
        onFieldsChange={(p) => setBase((b) => ({ ...b, ...p }))}
        onConfirm={() => setConfirmOpen(true)}
      >
        {def.fields.map((f) => (
          <FieldInput
            key={f.key}
            field={f}
            value={fields[f.key] ?? f.default}
            onChange={(v) => setFields((prev) => ({ ...prev, [f.key]: v }))}
          />
        ))}
      </BaseDialog>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        puzzleName={def.label}
        pageCount={base.pages}
        onConfirm={runGeneration}
      />
      <ProgressBar open={showProgress} progress={progress} label={progressLabel} />
    </>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: PuzzleFieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === "select" && field.options) {
    return (
      <div className="space-y-2">
        <Label>{field.label}</Label>
        <Select value={String(value)} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <Label>{field.label}</Label>
      <Input
        type="number"
        min={field.min}
        max={field.max}
        value={String(value)}
        onChange={(e) => onChange(parseInt(e.target.value) || field.default)}
      />
    </div>
  );
}
