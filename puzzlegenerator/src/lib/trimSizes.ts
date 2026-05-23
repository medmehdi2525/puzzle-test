import type { TrimSize } from "@/types/settings.types";

export interface TrimDimensions {
  widthIn: number;
  heightIn: number;
  label: string;
}

export const TRIM_SIZES: Record<TrimSize, TrimDimensions> = {
  "5x8": { widthIn: 5, heightIn: 8, label: '5" × 8"' },
  "5.06x7.81": { widthIn: 5.06, heightIn: 7.81, label: '5.06" × 7.81"' },
  "5.25x8": { widthIn: 5.25, heightIn: 8, label: '5.25" × 8"' },
  "5.5x8.5": { widthIn: 5.5, heightIn: 8.5, label: '5.5" × 8.5"' },
  "6x9": { widthIn: 6, heightIn: 9, label: '6" × 9"' },
  "6.14x9.21": { widthIn: 6.14, heightIn: 9.21, label: '6.14" × 9.21"' },
  "6.69x9.61": { widthIn: 6.69, heightIn: 9.61, label: '6.69" × 9.61"' },
  "7x10": { widthIn: 7, heightIn: 10, label: '7" × 10"' },
  "7.44x9.69": { widthIn: 7.44, heightIn: 9.69, label: '7.44" × 9.69"' },
  "7.5x9.25": { widthIn: 7.5, heightIn: 9.25, label: '7.5" × 9.25"' },
  "8x10": { widthIn: 8, heightIn: 10, label: '8" × 10"' },
  "8.25x6": { widthIn: 8.25, heightIn: 6, label: '8.25" × 6"' },
  "8.25x8.25": { widthIn: 8.25, heightIn: 8.25, label: '8.25" × 8.25"' },
  "8.27x11.69": { widthIn: 8.27, heightIn: 11.69, label: '8.27" × 11.69"' },
  "8.5x8.5": { widthIn: 8.5, heightIn: 8.5, label: '8.5" × 8.5"' },
  "8.5x11": { widthIn: 8.5, heightIn: 11, label: '8.5" × 11"' },
};

export const TRIM_SIZE_LIST = Object.entries(TRIM_SIZES) as [
  TrimSize,
  TrimDimensions,
][];

/** Screen preview: 72 DPI base */
export const PREVIEW_DPI = 72;

export function inchesToPx(inches: number, dpi = PREVIEW_DPI): number {
  return inches * dpi;
}

export function getPageDimensions(
  trim: TrimSize,
  bleedEnabled: boolean,
  bleedSize: number
): { widthPx: number; heightPx: number; trimWidthPx: number; trimHeightPx: number } {
  const { widthIn, heightIn } = TRIM_SIZES[trim];
  const bleed = bleedEnabled ? bleedSize * 2 : 0;
  const trimWidthPx = inchesToPx(widthIn);
  const trimHeightPx = inchesToPx(heightIn);
  return {
    widthPx: inchesToPx(widthIn + bleed),
    heightPx: inchesToPx(heightIn + bleed),
    trimWidthPx,
    trimHeightPx,
  };
}
