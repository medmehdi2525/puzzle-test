export type SudokuBoard = (number | null)[][];

function boxSize(n: number): number {
  if (n === 4) return 2;
  if (n === 9) return 3;
  if (n === 16) return 4;
  return Math.sqrt(n);
}

function isValid(board: SudokuBoard, row: number, col: number, num: number): boolean {
  const n = board.length;
  const bs = boxSize(n);
  for (let i = 0; i < n; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const br = Math.floor(row / bs) * bs;
  const bc = Math.floor(col / bs) * bs;
  for (let r = br; r < br + bs; r++) {
    for (let c = bc; c < bc + bs; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

export function solveSudoku(board: SudokuBoard): boolean {
  const n = board.length;
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (board[row][col] === null) {
        for (let num = 1; num <= n; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function countSolutions(board: SudokuBoard, limit = 2): number {
  const n = board.length;
  let count = 0;

  function backtrack(): void {
    if (count >= limit) return;
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (board[row][col] === null) {
          for (let num = 1; num <= n; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              backtrack();
              board[row][col] = null;
              if (count >= limit) return;
            }
          }
          return;
        }
      }
    }
    count++;
  }

  backtrack();
  return count;
}

export function cloneBoard(board: SudokuBoard): SudokuBoard {
  return board.map((row) => [...row]);
}
