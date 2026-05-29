export function parseJSON(src: string): unknown {
  let i = 0;

  function error(msg: string): never {
    throw new Error(`JSON parse error at ${i}: ${msg}`);
  }

  function skipWs(): void {
    while (i < src.length) {
      const c = src[i];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') i++;
      else break;
    }
  }

  function parseValue(): unknown {
    skipWs();
    if (i >= src.length) error('unexpected end of input');
    const c = src[i];
    if (c === '{') return parseObject();
    if (c === '[') return parseArray();
    if (c === '"') return parseString();
    if (c === '-' || (c >= '0' && c <= '9')) return parseNumber();
    if (src.startsWith('true', i)) {
      i += 4;
      return true;
    }
    if (src.startsWith('false', i)) {
      i += 5;
      return false;
    }
    if (src.startsWith('null', i)) {
      i += 4;
      return null;
    }
    error(`unexpected token '${c}'`);
  }

  function parseObject(): Record<string, unknown> {
    i++; // {
    const obj: Record<string, unknown> = {};
    skipWs();
    if (src[i] === '}') {
      i++;
      return obj;
    }
    for (;;) {
      skipWs();
      if (src[i] !== '"') error('expected string key');
      const key = parseString();
      skipWs();
      if (src[i] !== ':') error("expected ':'");
      i++;
      const val = parseValue();
      obj[key] = val;
      skipWs();
      const ch = src[i];
      if (ch === ',') {
        i++;
        continue;
      }
      if (ch === '}') {
        i++;
        return obj;
      }
      error("expected ',' or '}'");
    }
  }

  function parseArray(): unknown[] {
    i++; // [
    const arr: unknown[] = [];
    skipWs();
    if (src[i] === ']') {
      i++;
      return arr;
    }
    for (;;) {
      const val = parseValue();
      arr.push(val);
      skipWs();
      const ch = src[i];
      if (ch === ',') {
        i++;
        continue;
      }
      if (ch === ']') {
        i++;
        return arr;
      }
      error("expected ',' or ']'");
    }
  }

  function parseString(): string {
    i++; // opening quote
    let out = '';
    for (;;) {
      if (i >= src.length) error('unterminated string');
      const c = src[i++];
      if (c === '"') return out;
      if (c === '\\') {
        if (i >= src.length) error('unterminated escape');
        const e = src[i++];
        switch (e) {
          case '"':
            out += '"';
            break;
          case '\\':
            out += '\\';
            break;
          case '/':
            out += '/';
            break;
          case 'b':
            out += '\b';
            break;
          case 'f':
            out += '\f';
            break;
          case 'n':
            out += '\n';
            break;
          case 'r':
            out += '\r';
            break;
          case 't':
            out += '\t';
            break;
          case 'u': {
            const hex = src.slice(i, i + 4);
            if (hex.length < 4 || !/^[0-9a-fA-F]{4}$/.test(hex)) {
              error('invalid \\u escape');
            }
            out += String.fromCharCode(parseInt(hex, 16));
            i += 4;
            break;
          }
          default:
            error(`invalid escape '\\${e}'`);
        }
      } else if (c.charCodeAt(0) < 0x20) {
        error('unescaped control character in string');
      } else {
        out += c;
      }
    }
  }

  function parseNumber(): number {
    const start = i;
    if (src[i] === '-') i++;
    if (src[i] === '0') {
      i++;
    } else if (src[i] >= '1' && src[i] <= '9') {
      while (src[i] >= '0' && src[i] <= '9') i++;
    } else {
      error('invalid number');
    }
    if (src[i] === '.') {
      i++;
      if (!(src[i] >= '0' && src[i] <= '9')) error('invalid fraction');
      while (src[i] >= '0' && src[i] <= '9') i++;
    }
    if (src[i] === 'e' || src[i] === 'E') {
      i++;
      if (src[i] === '+' || src[i] === '-') i++;
      if (!(src[i] >= '0' && src[i] <= '9')) error('invalid exponent');
      while (src[i] >= '0' && src[i] <= '9') i++;
    }
    const text = src.slice(start, i);
    return Number(text);
  }

  const value = parseValue();
  skipWs();
  if (i < src.length) error('trailing content after value');
  return value;
}
