export type QueryValue = string | string[];

function decode(s: string): string {
  return decodeURIComponent(s.replace(/\+/g, ' '));
}

function encode(s: string): string {
  return encodeURIComponent(s);
}

export function parseQuery(qs: string): Record<string, QueryValue> {
  let s = qs;
  if (s.startsWith('?')) {
    s = s.slice(1);
  }
  const out: Record<string, QueryValue> = {};
  if (s === '') {
    return out;
  }
  for (const pair of s.split('&')) {
    if (pair === '') continue;
    const eq = pair.indexOf('=');
    let key: string;
    let value: string;
    if (eq === -1) {
      key = decode(pair);
      value = '';
    } else {
      key = decode(pair.slice(0, eq));
      value = decode(pair.slice(eq + 1));
    }
    if (Object.prototype.hasOwnProperty.call(out, key)) {
      const existing = out[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        out[key] = [existing, value];
      }
    } else {
      out[key] = value;
    }
  }
  return out;
}

export function stringifyQuery(obj: Record<string, QueryValue>): string {
  const parts: string[] = [];
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const ek = encode(key);
    if (Array.isArray(value)) {
      for (const v of value) {
        parts.push(`${ek}=${encode(v)}`);
      }
    } else {
      parts.push(`${ek}=${encode(value)}`);
    }
  }
  return parts.join('&');
}
