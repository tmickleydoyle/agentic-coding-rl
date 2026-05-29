const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

function digitValue(ch: string): number {
  const idx = DIGITS.indexOf(ch);
  return idx;
}

export function convert(value: string, fromBase: number, toBase: number): string {
  if (!Number.isInteger(fromBase) || fromBase < 2 || fromBase > 36) {
    throw new Error('fromBase must be an integer in 2..36');
  }
  if (!Number.isInteger(toBase) || toBase < 2 || toBase > 36) {
    throw new Error('toBase must be an integer in 2..36');
  }
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error('value must be a non-empty string');
  }

  const lower = value.toLowerCase();
  // Parse into an array of digit values (most-significant first).
  const inDigits: number[] = [];
  for (let i = 0; i < lower.length; i++) {
    const v = digitValue(lower[i]);
    if (v < 0 || v >= fromBase) {
      throw new Error(`invalid digit ${JSON.stringify(value[i])} for base ${fromBase}`);
    }
    inDigits.push(v);
  }

  // Strip leading zeros.
  let start = 0;
  while (start < inDigits.length - 1 && inDigits[start] === 0) start++;
  let current = inDigits.slice(start);

  if (current.length === 1 && current[0] === 0) {
    return '0';
  }

  // Repeated division: divide `current` (in fromBase) by toBase, collecting
  // remainders as output digits (least-significant first).
  const outDigits: number[] = [];
  while (!(current.length === 1 && current[0] === 0)) {
    const next: number[] = [];
    let remainder = 0;
    for (let i = 0; i < current.length; i++) {
      const acc = remainder * fromBase + current[i];
      const q = Math.floor(acc / toBase);
      remainder = acc % toBase;
      next.push(q);
    }
    // Normalize quotient (strip leading zeros).
    let s = 0;
    while (s < next.length - 1 && next[s] === 0) s++;
    current = next.slice(s);
    outDigits.push(remainder);
  }

  let result = '';
  for (let i = outDigits.length - 1; i >= 0; i--) {
    result += DIGITS[outDigits[i]];
  }
  return result;
}
