export type DiffEntry = { type: 'eq' | 'add' | 'del'; line: string };

export function diffLines(a: string[], b: string[]): DiffEntry[] {
  const m = a.length;
  const n = b.length;

  // LCS length DP table.
  const dp: number[][] = [];
  for (let i = 0; i <= m; i++) dp.push(new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Walk forward, buffering a run of dels/adds and flushing (dels before adds)
  // whenever we hit an eq (or at the end), so replace blocks read del-then-add.
  const out: DiffEntry[] = [];
  const pendingDel: string[] = [];
  const pendingAdd: string[] = [];

  const flush = (): void => {
    for (let k = 0; k < pendingDel.length; k++) {
      out.push({ type: 'del', line: pendingDel[k] });
    }
    for (let k = 0; k < pendingAdd.length; k++) {
      out.push({ type: 'add', line: pendingAdd[k] });
    }
    pendingDel.length = 0;
    pendingAdd.length = 0;
  };

  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      flush();
      out.push({ type: 'eq', line: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      pendingDel.push(a[i]);
      i++;
    } else {
      pendingAdd.push(b[j]);
      j++;
    }
  }
  while (i < m) {
    pendingDel.push(a[i]);
    i++;
  }
  while (j < n) {
    pendingAdd.push(b[j]);
    j++;
  }
  flush();

  return out;
}
