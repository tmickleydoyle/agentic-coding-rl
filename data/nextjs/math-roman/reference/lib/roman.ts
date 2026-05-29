const TABLE: ReadonlyArray<[number, string]> = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

const VALUES: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999) {
    throw new Error('toRoman requires an integer in 1..3999');
  }
  let rem = n;
  let out = '';
  for (let i = 0; i < TABLE.length; i++) {
    const [val, sym] = TABLE[i];
    while (rem >= val) {
      out += sym;
      rem -= val;
    }
  }
  return out;
}

export function fromRoman(s: string): number {
  if (typeof s !== 'string' || s.length === 0 || !/^[IVXLCDM]+$/.test(s)) {
    throw new Error(`invalid roman numeral: ${JSON.stringify(s)}`);
  }
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = VALUES[s[i]];
    const next = i + 1 < s.length ? VALUES[s[i + 1]] : 0;
    if (cur < next) {
      total -= cur;
    } else {
      total += cur;
    }
  }
  // Canonical check: only accept strings that round-trip exactly.
  if (total < 1 || total > 3999 || toRoman(total) !== s) {
    throw new Error(`non-canonical roman numeral: ${JSON.stringify(s)}`);
  }
  return total;
}
