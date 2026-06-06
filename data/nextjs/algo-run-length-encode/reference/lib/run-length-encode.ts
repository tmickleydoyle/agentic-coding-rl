export function encodePairs(s: string): Array<[number, string]> {
  if (s.length === 0) return [];
  const result: Array<[number, string]> = [];
  let count = 1;
  for (let i = 1; i <= s.length; i++) {
    if (i < s.length && s[i] === s[i - 1]) {
      count++;
    } else {
      result.push([count, s[i - 1]]);
      count = 1;
    }
  }
  return result;
}

export function encode(s: string): string {
  if (s.length === 0) return '';
  return encodePairs(s)
    .map(([count, char]) => (count === 1 ? char : `${count}${char}`))
    .join('');
}

export function decode(s: string): string {
  if (s.length === 0) return '';
  let result = '';
  let numStr = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= '0' && ch <= '9') {
      numStr += ch;
    } else {
      const count = numStr.length > 0 ? parseInt(numStr, 10) : 1;
      result += ch.repeat(count);
      numStr = '';
    }
  }
  return result;
}
