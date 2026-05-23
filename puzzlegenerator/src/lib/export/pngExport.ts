import type { PuzzlePage } from "@/types/page.types";
import type { BookSettings } from "@/types/settings.types";
import { getPageDimensions, PREVIEW_DPI, inchesToPx } from "@/lib/trimSizes";

export async function exportPagesAsPng(
  pages: PuzzlePage[],
  settings: BookSettings,
  options: { from: number; to: number; dpi: number; prefix: string }
): Promise<void> {
  const dims = getPageDimensions(
    settings.trim,
    settings.bleedEnabled,
    settings.bleedSize
  );
  const scale = options.dpi / PREVIEW_DPI;

  for (let i = options.from - 1; i < options.to && i < pages.length; i++) {
    const svg = document.getElementById(`page-svg-${pages[i].id}`);
    if (!svg) continue;
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = dims.widthPx * scale;
        canvas.height = dims.heightPx * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(); return; }
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((b) => {
          if (!b) { reject(); return; }
          const a = document.createElement("a");
          a.href = URL.createObjectURL(b);
          a.download = `${options.prefix}-page-${i + 1}.png`;
          a.click();
          URL.revokeObjectURL(a.href);
          resolve();
        }, "image/png");
        URL.revokeObjectURL(url);
      };
      img.onerror = reject;
      img.src = url;
    });
  }
}

export function printCurrentPage(): void {
  window.print();
}
