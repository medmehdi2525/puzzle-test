import { createRng, shuffle } from "@/lib/prng";

export function generateLatinSquare(n: number, rng: () => number): number[][] {
  const base: number[][] = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => ((r + c) % n) + 1)
  );
  const rows = shuffle([...Array(n).keys()], rng);
  const cols = shuffle([...Array(n).keys()], rng);
  const perm = shuffle([...Array(n).keys()].map((i) => i + 1), rng);
  return rows.map((r) => cols.map((c) => perm[base[r][c] - 1]));
}

export function rotateGrid<T>(grid: T[][]): T[][] {
  const n = grid.length;
  return Array.from({ length: n }, (_, c) =>
    Array.from({ length: n }, (_, r) => grid[n - 1 - r][c])
  );
}

export function mirrorGrid<T>(grid: T[][]): T[][] {
  return grid.map((row) => [...row].reverse());
}

export function applySymmetryRemoval(
  puzzle: (number | null)[][],
  rng: () => number,
  targetRemove: number,
  symmetry: "none" | "rotational" | "horizontal" | "diagonal"
): void {
  const n = puzzle.length;
  const pairs: [number, number][][] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (symmetry === "rotational") {
        pairs.push([
          [r, c],
          [n - 1 - r, n - 1 - c],
        ]);
      } else if (symmetry === "horizontal") {
        pairs.push([
          [r, c],
          [r, n - 1 - c],
        ]);
      } else if (symmetry === "diagonal" && r <= c) {
        pairs.push([
          [r, c],
          [c, r],
        ]);
      } else if (symmetry === "none") {
        pairs.push([[r, c]]);
      }
    }
  }
  const unique = dedupePairs(pairs);
  const order = shuffle(unique, rng);
  let removed = 0;
  for (const cells of order) {
    if (removed >= targetRemove) break;
    const can = cells.every(([r, c]) => puzzle[r][c] !== null);
    if (can) {
      for (const [r, c] of cells) puzzle[r][c] = null;
      removed += cells.length;
    }
  }
}

function dedupePairs(pairs: [number, number][][]): [number, number][][] {
  const seen = new Set<string>();
  const out: [number, number][][] = [];
  for (const p of pairs) {
    const key = p
      .map(([r, c]) => `${r},${c}`)
      .sort()
      .join("|");
    if (!seen.has(key)) {
      seen.add(key);
      out.push(p);
    }
  }
  return out;
}

export function rngFromSeed(seed: number): () => number {
  return createRng(seed);
}
