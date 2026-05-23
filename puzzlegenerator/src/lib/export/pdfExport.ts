import type { PuzzlePage } from "@/types/page.types";
import type { BookSettings } from "@/types/settings.types";
import { TRIM_SIZES } from "@/lib/trimSizes";

/** Client-side print-to-PDF via browser print dialog */
export function exportBookViaPrint(): void {
  window.print();
}

export function buildExportMetadata(pages: PuzzlePage[], settings: BookSettings) {
  const trim = TRIM_SIZES[settings.trim];
  return {
    pageCount: pages.length,
    trimLabel: trim.label,
    widthIn: trim.widthIn + (settings.bleedEnabled ? settings.bleedSize * 2 : 0),
    heightIn: trim.heightIn + (settings.bleedEnabled ? settings.bleedSize * 2 : 0),
    bleed: settings.bleedEnabled,
  };
}
