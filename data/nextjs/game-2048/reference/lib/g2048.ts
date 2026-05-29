export type Dir = 'L' | 'R' | 'U' | 'D';

// Slide left and report points gained from merges.
function slideWithGain(row: number[]): { row: number[]; gained: number } {
  const compact = row.filter((v) => v !== 0);
  const merged: number[] = [];
  let gained = 0;
  let i = 0;
  while (i < compact.length) {
    if (i + 1 < compact.length && compact[i] === compact[i + 1]) {
      const sum = compact[i] * 2;
      merged.push(sum);
      gained += sum;
      i += 2;
    } else {
      merged.push(compact[i]);
      i += 1;
    }
  }
  while (merged.length < row.length) merged.push(0);
  return { row: merged, gained };
}

export function slide(row: number[]): number[] {
  return slideWithGain(row).row;
}

export function move(
  grid: number[][],
  dir: Dir,
): { grid: number[][]; gained: number } {
  const n = grid.length;
  const result: number[][] = grid.map((row) => row.slice());
  let gained = 0;

  if (dir === 'L' || dir === 'R') {
    for (let r = 0; r < n; r++) {
      let line = result[r].slice();
      if (dir === 'R') line.reverse();
      const out = slideWithGain(line);
      gained += out.gained;
      line = out.row;
      if (dir === 'R') line.reverse();
      result[r] = line;
    }
  } else {
    for (let c = 0; c < n; c++) {
      let line: number[] = [];
      for (let r = 0; r < n; r++) line.push(result[r][c]);
      if (dir === 'D') line.reverse();
      const out = slideWithGain(line);
      gained += out.gained;
      line = out.row;
      if (dir === 'D') line.reverse();
      for (let r = 0; r < n; r++) result[r][c] = line[r];
    }
  }

  return { grid: result, gained };
}
