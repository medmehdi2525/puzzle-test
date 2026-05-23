/** Fingerprint grids/text puzzles to reject near-duplicates in a batch */
export function fingerprint(value: unknown): string {
  return stableStringify(value).slice(0, 512);
}

function stableStringify(obj: unknown): string {
  if (obj === null || obj === undefined) return "";
  if (typeof obj !== "object") return String(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
  const rec = obj as Record<string, unknown>;
  const keys = Object.keys(rec).sort();
  return `{${keys.map((k) => `${k}:${stableStringify(rec[k])}`).join(",")}}`;
}

export function isTooSimilar(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 8 || b.length < 8) return a === b;
  let same = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) if (a[i] === b[i]) same++;
  return same / len > 0.92;
}

export class BatchDeduplicator {
  private seen = new Set<string>();

  accept(fp: string): boolean {
    for (const s of this.seen) {
      if (isTooSimilar(fp, s)) return false;
    }
    this.seen.add(fp);
    return true;
  }
}
