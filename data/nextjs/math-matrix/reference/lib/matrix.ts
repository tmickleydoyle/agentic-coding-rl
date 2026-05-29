export type Matrix = number[][];

function isSquare(m: Matrix): boolean {
  return m.length > 0 && m.every((row) => row.length === m.length);
}

export function multiply(a: Matrix, b: Matrix): Matrix {
  const aCols = a.length > 0 ? a[0].length : 0;
  if (aCols !== b.length) {
    throw new Error('dimension mismatch: a columns must equal b rows');
  }
  const bCols = b.length > 0 ? b[0].length : 0;
  const out: Matrix = [];
  for (let i = 0; i < a.length; i++) {
    const row = new Array<number>(bCols).fill(0);
    for (let k = 0; k < aCols; k++) {
      const aik = a[i][k];
      for (let j = 0; j < bCols; j++) {
        row[j] += aik * b[k][j];
      }
    }
    out.push(row);
  }
  return out;
}

export function transpose(m: Matrix): Matrix {
  const rows = m.length;
  const cols = rows > 0 ? m[0].length : 0;
  const out: Matrix = [];
  for (let j = 0; j < cols; j++) {
    const row = new Array<number>(rows);
    for (let i = 0; i < rows; i++) {
      row[i] = m[i][j];
    }
    out.push(row);
  }
  return out;
}

export function identity(n: number): Matrix {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error('identity requires a positive integer size');
  }
  const out: Matrix = [];
  for (let i = 0; i < n; i++) {
    const row = new Array<number>(n).fill(0);
    row[i] = 1;
    out.push(row);
  }
  return out;
}

export function determinant(m: Matrix): number {
  if (!isSquare(m)) {
    throw new Error('determinant requires a square matrix');
  }
  const n = m.length;
  // Work on a copy; LU-style elimination with partial pivoting.
  const a = m.map((row) => row.slice());
  let det = 1;
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r;
    }
    if (Math.abs(a[pivot][col]) < 1e-12) return 0;
    if (pivot !== col) {
      const tmp = a[pivot];
      a[pivot] = a[col];
      a[col] = tmp;
      det = -det;
    }
    det *= a[col][col];
    for (let r = col + 1; r < n; r++) {
      const factor = a[r][col] / a[col][col];
      for (let c = col; c < n; c++) {
        a[r][c] -= factor * a[col][c];
      }
    }
  }
  return det;
}

export function inverse(m: Matrix): Matrix | null {
  if (!isSquare(m)) {
    throw new Error('inverse requires a square matrix');
  }
  const n = m.length;
  // Augment [m | I] and run Gauss-Jordan.
  const aug: Matrix = m.map((row, i) => {
    const idRow = new Array<number>(n).fill(0);
    idRow[i] = 1;
    return row.slice().concat(idRow);
  });
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(aug[r][col]) > Math.abs(aug[pivot][col])) pivot = r;
    }
    if (Math.abs(aug[pivot][col]) < 1e-12) return null;
    if (pivot !== col) {
      const tmp = aug[pivot];
      aug[pivot] = aug[col];
      aug[col] = tmp;
    }
    const pv = aug[col][col];
    for (let c = 0; c < 2 * n; c++) {
      aug[col][c] /= pv;
    }
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = aug[r][col];
      if (factor === 0) continue;
      for (let c = 0; c < 2 * n; c++) {
        aug[r][c] -= factor * aug[col][c];
      }
    }
  }
  return aug.map((row) => row.slice(n));
}
