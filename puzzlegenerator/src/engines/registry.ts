import type { PuzzleType } from "@/types/settings.types";
import { createRng, shuffle, shuffleString, randomInt } from "@/lib/prng";
import { fingerprint } from "@/lib/similarity";
import { generateSudoku } from "./sudoku/generator";
import { generateLatinSquare } from "./shared/latin";
import { pickWords, pickQuote, WORD_CATEGORIES } from "./shared/words";
import type { SudokuDifficulty, SudokuGridSize } from "@/types/puzzle.types";

export interface GenResult {
  puzzleData: Record<string, unknown>;
  solutionData: Record<string, unknown>;
  fingerprint: string;
}

export type PuzzleSettings = Record<string, unknown>;

function rng(seed: number) {
  return createRng(seed);
}

function gridCells(rows: number, cols: number, fill: string | number | null = null) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ value: fill as string | number | null }))
  );
}

export function generatePuzzle(
  type: PuzzleType,
  seed: number,
  settings: PuzzleSettings
): GenResult | null {
  switch (type) {
    case "sudoku":
      return genSudoku(seed, settings);
    case "wordSearch":
      return genWordSearch(seed, settings);
    case "wordScramble":
      return genWordScramble(seed, settings);
    case "hangman":
      return genHangman(seed, settings);
    case "cryptogram":
      return genCryptogram(seed, settings);
    case "missingVowels":
      return genMissingVowels(seed, settings);
    case "kidsMath":
      return genKidsMath(seed, settings);
    case "oneHundred":
      return genOneHundred(seed, settings);
    case "ticTacToe":
      return genTicTacToe(seed, settings);
    case "ticTacLogic":
      return genTicTacLogic(seed, settings);
    case "calcudoku":
      return genCalcudoku(seed, settings);
    case "skyscraper":
      return genSkyscraper(seed, settings);
    case "kakurasu":
      return genKakurasu(seed, settings);
    case "hitori":
      return genHitori(seed, settings);
    case "nurikabe":
      return genNurikabe(seed, settings);
    case "shikaku":
      return genShikaku(seed, settings);
    case "rangePuzzle":
      return genRange(seed, settings);
    case "mineFinder":
      return genMines(seed, settings);
    case "warships":
      return genWarships(seed, settings);
    case "fourInARow":
      return genFourInARow(seed, settings);
    case "abcPath":
      return genAbcPath(seed, settings);
    case "crossword":
      return genCrossword(seed, settings);
    case "wordPuzzle":
      return genBoggle(seed, settings);
    case "numberPlace":
      return genNumberPlace(seed, settings);
    default:
      return null;
  }
}

function genSudoku(seed: number, s: PuzzleSettings): GenResult | null {
  const r = generateSudoku(
    seed,
    (s.gridSize as SudokuGridSize) ?? 9,
    (s.difficulty as SudokuDifficulty) ?? "medium"
  );
  if (!r) return null;
  const pd = { ...r.puzzleData, kind: "sudoku" };
  return {
    puzzleData: pd as Record<string, unknown>,
    solutionData: r.solutionData as Record<string, unknown>,
    fingerprint: fingerprint(pd),
  };
}

function genWordSearch(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const size = (s.gridSize as number) ?? 12;
  const words = pickWords((s.category as string) ?? "animals", (s.wordCount as number) ?? 10, rand);
  const grid: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "")
  );
  const placed: string[] = [];
  const dirs = [
    [0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1],
  ];
  for (const word of shuffle([...words], rand)) {
    for (let t = 0; t < 80; t++) {
      const [dr, dc] = dirs[Math.floor(rand() * dirs.length)];
      const r0 = Math.floor(rand() * size);
      const c0 = Math.floor(rand() * size);
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const r = r0 + dr * i;
        const c = c0 + dc * i;
        if (r < 0 || r >= size || c < 0 || c >= size) {
          ok = false;
          break;
        }
        if (grid[r][c] && grid[r][c] !== word[i]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        for (let i = 0; i < word.length; i++) {
          grid[r0 + dr * i][c0 + dc * i] = word[i];
        }
        placed.push(word);
        break;
      }
    }
  }
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = letters[Math.floor(rand() * 26)];
    }
  }
  const cells = grid.map((row) => row.map((v) => ({ value: v })));
  const pd = { kind: "grid", rows: size, cols: size, cells, wordList: placed, title: "Word Search" };
  return {
    puzzleData: pd,
    solutionData: { words: placed },
    fingerprint: fingerprint({ placed, size }),
  };
}

function genWordScramble(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const words = pickWords((s.category as string) ?? "animals", 8, rand);
  const items = words.map((w) => {
    let scrambled = shuffleString(w, rand);
    while (scrambled === w) scrambled = shuffleString(w, rand);
    return { word: w, scrambled };
  });
  const pd = { kind: "list", title: "Word Scramble", items };
  return { puzzleData: pd, solutionData: { items }, fingerprint: fingerprint(items) };
}

function genHangman(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const word = pickWords((s.category as string) ?? "animals", 1, rand)[0];
  const reveal = (s.preReveal as number) ?? 0;
  const shown = new Set<string>();
  for (let i = 0; i < reveal; i++) {
    const c = word[Math.floor(rand() * word.length)];
    shown.add(c);
  }
  const pd = { kind: "hangman", word, shown: [...shown], blanks: word.replace(/[A-Z]/g, (c) => (shown.has(c) ? c : "_")) };
  return { puzzleData: pd, solutionData: { word }, fingerprint: fingerprint(word) };
}

function genCryptogram(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const text = pickQuote(rand).toUpperCase();
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const map: Record<string, string> = {};
  const used = new Set<string>();
  for (const ch of alphabet) {
    let c: string;
    do {
      c = alphabet[Math.floor(rand() * 26)];
    } while (used.has(c) || c === ch);
    used.add(c);
    map[ch] = c;
  }
  const encoded = text.replace(/[A-Z]/g, (c) => map[c] ?? c);
  const pd = { kind: "cryptogram", encoded, hintCount: (s.hintCount as number) ?? 2 };
  return { puzzleData: pd, solutionData: { text }, fingerprint: fingerprint(encoded) };
}

function genMissingVowels(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const words = pickWords((s.category as string) ?? "food", 6, rand);
  const items = words.map((w) => ({
    original: w,
    display: w.replace(/[AEIOU]/g, "_"),
  }));
  const pd = { kind: "list", title: "Missing Vowels", items };
  return { puzzleData: pd, solutionData: { items }, fingerprint: fingerprint(items) };
}

function genKidsMath(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const count = (s.equationsPerPage as number) ?? 12;
  const ops = (s.operators as string[]) ?? ["+", "-", "×"];
  const min = (s.min as number) ?? 1;
  const max = (s.max as number) ?? 20;
  const equations: { text: string; answer: number }[] = [];
  for (let i = 0; i < count; i++) {
    const a = randomInt(rand, min, max);
    const b = randomInt(rand, min, max);
    const op = ops[Math.floor(rand() * ops.length)];
    let text = "";
    let answer = 0;
    if (op === "+") { text = `${a} + ${b} = ___`; answer = a + b; }
    else if (op === "-") {
      const x = Math.max(a, b);
      const y = Math.min(a, b);
      text = `${x} - ${y} = ___`;
      answer = x - y;
    } else if (op === "×") { text = `${a} × ${b} = ___`; answer = a * b; }
    else { text = `${a * b} ÷ ${b} = ___`; answer = a; }
    equations.push({ text, answer });
  }
  const pd = { kind: "list", title: "Math Practice", items: equations.map((e) => ({ text: e.text })) };
  return { puzzleData: pd, solutionData: { equations }, fingerprint: fingerprint(equations) };
}

function genOneHundred(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const n = (s.gridSize as number) === 4 ? 4 : 3;
  const target = (s.target as number) ?? 100;
  const sol = generateLatinSquare(n, rand).map((row) =>
    row.map((v) => Math.floor((v / n) * (target / n) + randomInt(rand, 1, 9)))
  );
  const cells = sol.map((row, r) =>
    row.map((v, c) => ({
      value: rand() > 0.35 ? v : null,
    }))
  );
  const pd = { kind: "grid", rows: n, cols: n, cells, title: `Sums to ${target}`, boxW: 1, boxH: 1 };
  const solCells = sol.map((row) => row.map((v) => ({ value: v })));
  return {
    puzzleData: pd,
    solutionData: { cells: solCells },
    fingerprint: fingerprint(sol),
  };
}

function genTicTacToe(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const n = (s.gridSize as number) === 5 ? 5 : 3;
  const cells = gridCells(n, n, "");
  const moves = randomInt(rand, 0, (s.preFilled as number) ?? 3);
  const symbols = ["X", "O"];
  for (let m = 0; m < moves; m++) {
    const r = Math.floor(rand() * n);
    const c = Math.floor(rand() * n);
    if (!cells[r][c].value) cells[r][c].value = symbols[m % 2];
  }
  const pd = { kind: "grid", rows: n, cols: n, cells, title: "Tic Tac Toe" };
  return { puzzleData: pd, solutionData: {}, fingerprint: fingerprint(cells) };
}

function genTicTacLogic(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const n = (s.gridSize as number) ?? 6;
  const half = n / 2;
  const sol: string[][] = [];
  for (let r = 0; r < n; r++) {
    const row: string[] = [];
    for (let c = 0; c < n; c++) row.push(c < half ? "O" : "X");
    sol.push(shuffle(row, rand));
  }
  const cells = sol.map((row) =>
    row.map((v) => ({ value: rand() > 0.25 ? v : null }))
  );
  const pd = { kind: "grid", rows: n, cols: n, cells, title: "Tic Tac Logic" };
  const solCells = sol.map((row) => row.map((v) => ({ value: v })));
  return { puzzleData: pd, solutionData: { cells: solCells }, fingerprint: fingerprint(sol) };
}

function genCalcudoku(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const n = (s.gridSize as number) ?? 5;
  const sol = generateLatinSquare(n, rand);
  const cells = sol.map((row) => row.map((v) => ({ value: v as number })));
  const pd = { kind: "grid", rows: n, cols: n, cells, title: "CalcuDoku", subtitle: "Fill 1-" + n };
  return { puzzleData: pd, solutionData: { cells }, fingerprint: fingerprint(sol) };
}

function genSkyscraper(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const n = (s.gridSize as number) ?? 4;
  const sol = generateLatinSquare(n, rand);
  const clues = { top: [] as number[], bottom: [] as number[], left: [] as number[], right: [] as number[] };
  for (let c = 0; c < n; c++) {
    clues.top.push(countVisible(sol.map((r) => r[c])));
    clues.bottom.push(countVisible([...sol.map((r) => r[c])].reverse()));
  }
  for (let r = 0; r < n; r++) {
    clues.left.push(countVisible(sol[r]));
    clues.right.push(countVisible([...sol[r]].reverse()));
  }
  const cells = gridCells(n, n, null);
  const pd = { kind: "grid", rows: n, cols: n, cells, clues, title: "Skyscraper" };
  const solCells = sol.map((row) => row.map((v) => ({ value: v })));
  return { puzzleData: pd, solutionData: { cells: solCells }, fingerprint: fingerprint(sol) };
}

function countVisible(line: number[]): number {
  let max = 0;
  let count = 0;
  for (const h of line) {
    if (h > max) { count++; max = h; }
  }
  return count;
}

function genKakurasu(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const n = (s.gridSize as number) ?? 6;
  const sol: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) if (rand() > 0.55) sol[r][c] = 1;
  }
  const rowClues = sol.map((row) => row.reduce((s, v, i) => s + (v ? i + 1 : 0), 0));
  const colClues = Array.from({ length: n }, (_, c) =>
    sol.reduce((s, row, i) => s + (row[c] ? i + 1 : 0), 0)
  );
  const cells = gridCells(n, n, null);
  const pd = { kind: "grid", rows: n, cols: n, cells, rowClues, colClues, title: "Kakurasu" };
  const solCells = sol.map((row) => row.map((v) => ({ value: v ? "■" : "" })));
  return { puzzleData: pd, solutionData: { cells: solCells }, fingerprint: fingerprint(sol) };
}

function genHitori(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const n = (s.gridSize as number) ?? 6;
  const nums = generateLatinSquare(n, rand);
  const cells = nums.map((row) => row.map((v) => ({ value: v })));
  const pd = { kind: "grid", rows: n, cols: n, cells, title: "Hitori", subtitle: "Circle duplicates" };
  return { puzzleData: pd, solutionData: { cells }, fingerprint: fingerprint(nums) };
}

function genNurikabe(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const n = (s.gridSize as number) ?? 8;
  const cells = gridCells(n, n, null);
  for (let i = 0; i < Math.floor(n / 2); i++) {
    const r = Math.floor(rand() * n);
    const c = Math.floor(rand() * n);
    cells[r][c] = { value: randomInt(rand, 1, 4), fill: "#fff" };
  }
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!cells[r][c].value) cells[r][c] = { value: "", fill: rand() > 0.45 ? "#222" : "#fff" };
    }
  }
  const pd = { kind: "grid", rows: n, cols: n, cells, title: "Nurikabe" };
  return { puzzleData: pd, solutionData: { cells }, fingerprint: fingerprint(cells) };
}

function genShikaku(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const n = (s.gridSize as number) ?? 8;
  const cells = gridCells(n, n, null);
  for (let i = 0; i < n; i++) {
    const r = Math.floor(rand() * n);
    const c = Math.floor(rand() * n);
    cells[r][c] = { value: randomInt(rand, 2, 6), bold: true };
  }
  const pd = { kind: "grid", rows: n, cols: n, cells, title: "Shikaku" };
  return { puzzleData: pd, solutionData: {}, fingerprint: fingerprint(cells) };
}

function genRange(seed: number, s: PuzzleSettings): GenResult {
  return genNurikabe(seed, { ...s, gridSize: (s.gridSize as number) ?? 7 });
}

function genMines(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const n = (s.gridSize as number) ?? 8;
  const mines: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
  const count = (s.mines as number) ?? 10;
  let placed = 0;
  while (placed < count) {
    const r = Math.floor(rand() * n);
    const c = Math.floor(rand() * n);
    if (!mines[r][c]) { mines[r][c] = true; placed++; }
  }
  const cells = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => {
      if (mines[r][c]) return { value: "" };
      let adj = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < n && nc >= 0 && nc < n && mines[nr][nc]) adj++;
        }
      }
      return { value: adj || "" };
    })
  );
  const pd = { kind: "grid", rows: n, cols: n, cells, title: "Mine Finder" };
  return { puzzleData: pd, solutionData: { mines }, fingerprint: fingerprint(mines) };
}

function genWarships(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const n = (s.gridSize as number) ?? 8;
  const grid = Array.from({ length: n }, () => Array(n).fill(0));
  const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  for (const len of ships) {
    for (let t = 0; t < 50; t++) {
      const horiz = rand() > 0.5;
      const r = Math.floor(rand() * n);
      const c = Math.floor(rand() * n);
      let ok = true;
      for (let i = 0; i < len; i++) {
        const rr = horiz ? r : r + i;
        const cc = horiz ? c + i : c;
        if (rr >= n || cc >= n || grid[rr][cc]) { ok = false; break; }
      }
      if (ok) {
        for (let i = 0; i < len; i++) {
          if (horiz) grid[r][c + i] = 1;
          else grid[r + i][c] = 1;
        }
        break;
      }
    }
  }
  const cells = grid.map((row) => row.map((v) => ({ value: v ? "" : null })));
  const rowClues = grid.map((row) => row.reduce((a, b) => a + b, 0));
  const colClues = Array.from({ length: n }, (_, c) => grid.reduce((a, row) => a + row[c], 0));
  const pd = { kind: "grid", rows: n, cols: n, cells, rowClues, colClues, title: "Warships" };
  const solCells = grid.map((row) => row.map((v) => ({ value: v ? "■" : "", fill: v ? "#333" : undefined })));
  return { puzzleData: pd, solutionData: { cells: solCells }, fingerprint: fingerprint(grid) };
}

function genFourInARow(seed: number, _s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const rows = 6;
  const cols = 7;
  const cells = gridCells(rows, cols, null);
  for (let m = 0; m < 8; m++) {
    const c = Math.floor(rand() * cols);
    for (let r = rows - 1; r >= 0; r--) {
      if (!cells[r][c].value) {
        cells[r][c].value = m % 2 === 0 ? "●" : "○";
        break;
      }
    }
  }
  const pd = { kind: "grid", rows, cols, cells, title: "Four In A Row" };
  return { puzzleData: pd, solutionData: {}, fingerprint: fingerprint(cells) };
}

function genAbcPath(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const n = (s.gridSize as number) === 7 ? 7 : 5;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXY".slice(0, n * n);
  const cells = gridCells(n, n, null);
  let idx = 0;
  let r = 0;
  let c = 0;
  for (const ch of letters) {
    cells[r][c] = { value: ch };
    idx++;
    const options: [number, number][] = [];
    for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && !cells[nr][nc].value)
        options.push([nr, nc]);
    }
    if (!options.length) break;
    const pick = options[Math.floor(rand() * options.length)];
    r = pick[0];
    c = pick[1];
  }
  const pd = { kind: "grid", rows: n, cols: n, cells, title: "ABC Path" };
  return { puzzleData: pd, solutionData: { cells }, fingerprint: fingerprint(cells) };
}

function genCrossword(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const words = pickWords((s.category as string) ?? "animals", 6, rand).map((w) => w.toUpperCase());
  const n = 11;
  const grid: (string | null)[][] = Array.from({ length: n }, () => Array(n).fill(null));
  const mid = Math.floor(n / 2);
  const w0 = words[0];
  for (let i = 0; i < w0.length; i++) grid[mid][i + 1] = w0[i];
  if (words[1]) {
    const w1 = words[1];
    const col = mid + 2;
    for (let i = 0; i < w1.length && col < n; i++) grid[i + 1]?.[col] = w1[i];
  }
  const cells = grid.map((row) =>
    row.map((v) => (v ? { value: v } : { value: "", fill: "#222" }))
  );
  const pd = { kind: "grid", rows: n, cols: n, cells, title: "Crossword", clues: words };
  return { puzzleData: pd, solutionData: { words }, fingerprint: fingerprint(words) };
}

function genBoggle(seed: number, s: PuzzleSettings): GenResult {
  const rand = rng(seed);
  const n = (s.gridSize as number) === 5 ? 5 : 4;
  const freq = "EEEEEEEEEEEEAAAAAAAAAIIIIIIIIIIOOOOOOOONNNNNNNRRRRRRTTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVKWJXYZ";
  const grid: string[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => freq[Math.floor(rand() * freq.length)])
  );
  const cells = grid.map((row) => row.map((v) => ({ value: v })));
  const pd = { kind: "grid", rows: n, cols: n, cells, title: "Word Puzzle" };
  return { puzzleData: pd, solutionData: {}, fingerprint: fingerprint(grid) };
}

function genNumberPlace(seed: number, s: PuzzleSettings): GenResult | null {
  const r = genSudoku(seed, { ...s, gridSize: 9 });
  if (!r) return null;
  r.puzzleData.title = "Number Place (Jigsaw)";
  return r;
}

export const WORD_CATEGORY_OPTIONS = Object.keys(WORD_CATEGORIES);
