export type Op =
  | { type: 'insert'; index: number; char: string }
  | { type: 'delete'; index: number; char: string }
  | { type: 'substitute'; index: number; from: string; to: string };

function buildDP(a: string, b: string): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = [];
  for (let i = 0; i <= m; i++) {
    dp.push(new Array<number>(n + 1).fill(0));
  }
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp;
}

export function levenshtein(a: string, b: string): number {
  return buildDP(a, b)[a.length][b.length];
}

// Internal alignment step kinds, in forward (left-to-right) order over the strings.
type Step =
  | { kind: 'keep'; ch: string }
  | { kind: 'sub'; from: string; to: string }
  | { kind: 'del'; ch: string }
  | { kind: 'ins'; ch: string };

export function editScript(a: string, b: string): Op[] {
  const dp = buildDP(a, b);
  // Backtrack from (m, n) to (0, 0), recording steps in reverse.
  let i = a.length;
  let j = b.length;
  const rev: Step[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1] && dp[i][j] === dp[i - 1][j - 1]) {
      rev.push({ kind: 'keep', ch: a[i - 1] });
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      rev.push({ kind: 'sub', from: a[i - 1], to: b[j - 1] });
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      rev.push({ kind: 'del', ch: a[i - 1] });
      i--;
    } else {
      // insert b[j-1]
      rev.push({ kind: 'ins', ch: b[j - 1] });
      j--;
    }
  }
  const steps = rev.reverse();

  // Walk steps left-to-right, tracking the live index into the evolving string.
  const ops: Op[] = [];
  let pos = 0;
  for (let k = 0; k < steps.length; k++) {
    const s = steps[k];
    if (s.kind === 'keep') {
      pos++;
    } else if (s.kind === 'sub') {
      ops.push({ type: 'substitute', index: pos, from: s.from, to: s.to });
      pos++;
    } else if (s.kind === 'del') {
      ops.push({ type: 'delete', index: pos, char: s.ch });
      // deleted char removed -> pos stays
    } else {
      ops.push({ type: 'insert', index: pos, char: s.ch });
      pos++;
    }
  }
  return ops;
}

export function applyScript(a: string, ops: Op[]): string {
  const chars = a.split('');
  for (let k = 0; k < ops.length; k++) {
    const op = ops[k];
    if (op.type === 'insert') {
      chars.splice(op.index, 0, op.char);
    } else if (op.type === 'delete') {
      chars.splice(op.index, 1);
    } else {
      chars[op.index] = op.to;
    }
  }
  return chars.join('');
}
