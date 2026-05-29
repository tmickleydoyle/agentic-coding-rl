function validate(s: string): void {
  if (typeof s !== 'string' || !/^[0-9]+$/.test(s)) {
    throw new Error(`invalid bignum: ${JSON.stringify(s)}`);
  }
}

function strip(s: string): string {
  let i = 0;
  while (i < s.length - 1 && s[i] === '0') i++;
  return s.slice(i);
}

export function compare(a: string, b: string): number {
  validate(a);
  validate(b);
  const x = strip(a);
  const y = strip(b);
  if (x.length !== y.length) return x.length < y.length ? -1 : 1;
  if (x < y) return -1;
  if (x > y) return 1;
  return 0;
}

export function add(a: string, b: string): string {
  validate(a);
  validate(b);
  const x = strip(a);
  const y = strip(b);
  let i = x.length - 1;
  let j = y.length - 1;
  let carry = 0;
  const out: string[] = [];
  while (i >= 0 || j >= 0 || carry > 0) {
    const da = i >= 0 ? x.charCodeAt(i) - 48 : 0;
    const db = j >= 0 ? y.charCodeAt(j) - 48 : 0;
    const sum = da + db + carry;
    out.push(String(sum % 10));
    carry = Math.floor(sum / 10);
    i--;
    j--;
  }
  return strip(out.reverse().join(''));
}

export function subtract(a: string, b: string): string {
  validate(a);
  validate(b);
  if (compare(a, b) < 0) {
    throw new Error('subtract requires a >= b');
  }
  const x = strip(a);
  const y = strip(b);
  let i = x.length - 1;
  let j = y.length - 1;
  let borrow = 0;
  const out: string[] = [];
  while (i >= 0) {
    const da = x.charCodeAt(i) - 48;
    const db = j >= 0 ? y.charCodeAt(j) - 48 : 0;
    let diff = da - db - borrow;
    if (diff < 0) {
      diff += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    out.push(String(diff));
    i--;
    j--;
  }
  return strip(out.reverse().join(''));
}

export function multiply(a: string, b: string): string {
  validate(a);
  validate(b);
  const x = strip(a);
  const y = strip(b);
  if (x === '0' || y === '0') return '0';
  const result = new Array<number>(x.length + y.length).fill(0);
  for (let i = x.length - 1; i >= 0; i--) {
    const da = x.charCodeAt(i) - 48;
    for (let j = y.length - 1; j >= 0; j--) {
      const db = y.charCodeAt(j) - 48;
      const pos = i + j + 1;
      const cur = result[pos] + da * db;
      result[pos] = cur % 10;
      result[i + j] += Math.floor(cur / 10);
    }
  }
  return strip(result.join(''));
}
