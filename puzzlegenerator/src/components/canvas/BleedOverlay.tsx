import { inchesToPx } from "@/lib/trimSizes";

interface BleedOverlayProps {
  bleedSizeIn: number;
  trimWidthPx: number;
  trimHeightPx: number;
}

export function BleedOverlay({
  bleedSizeIn,
  trimWidthPx,
  trimHeightPx,
}: BleedOverlayProps) {
  const bleedPx = inchesToPx(bleedSizeIn);
  return (
    <rect
      x={bleedPx}
      y={bleedPx}
      width={trimWidthPx}
      height={trimHeightPx}
      fill="none"
      stroke="#dc2626"
      strokeWidth={1}
      strokeDasharray="6 4"
      pointerEvents="none"
    />
  );
}
