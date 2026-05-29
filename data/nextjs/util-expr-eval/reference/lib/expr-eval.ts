type Tok =
  | { kind: 'num'; value: number }
  | { kind: 'op'; value: '+' | '-' | '*' | '/' }
  | { kind: 'lp' }
  | { kind: 'rp' };

function tokenize(expr: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  while (i < expr.length) {
    const c = expr[i];
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      i++;
      continue;
    }
    if (c === '+' || c === '-' || c === '*' || c === '/') {
      toks.push({ kind: 'op', value: c });
      i++;
      continue;
    }
    if (c === '(') {
      toks.push({ kind: 'lp' });
      i++;
      continue;
    }
    if (c === ')') {
      toks.push({ kind: 'rp' });
      i++;
      continue;
    }
    if ((c >= '0' && c <= '9') || c === '.') {
      let j = i;
      let dots = 0;
      while (j < expr.length && ((expr[j] >= '0' && expr[j] <= '9') || expr[j] === '.')) {
        if (expr[j] === '.') dots++;
        j++;
      }
      const slice = expr.slice(i, j);
      if (dots > 1 || slice === '.') throw new Error(`bad number: ${slice}`);
      const value = Number(slice);
      if (Number.isNaN(value)) throw new Error(`bad number: ${slice}`);
      toks.push({ kind: 'num', value });
      i = j;
      continue;
    }
    throw new Error(`unexpected character: ${c}`);
  }
  return toks;
}

export function evaluate(expr: string): number {
  const toks = tokenize(expr);
  let pos = 0;

  const peek = (): Tok | undefined => toks[pos];

  // expression := term (('+' | '-') term)*
  const parseExpr = (): number => {
    let left = parseTerm();
    while (true) {
      const t = peek();
      if (t && t.kind === 'op' && (t.value === '+' || t.value === '-')) {
        pos++;
        const right = parseTerm();
        left = t.value === '+' ? left + right : left - right;
      } else {
        break;
      }
    }
    return left;
  };

  // term := factor (('*' | '/') factor)*
  const parseTerm = (): number => {
    let left = parseFactor();
    while (true) {
      const t = peek();
      if (t && t.kind === 'op' && (t.value === '*' || t.value === '/')) {
        pos++;
        const right = parseFactor();
        if (t.value === '/') {
          if (right === 0) throw new Error('division by zero');
          left = left / right;
        } else {
          left = left * right;
        }
      } else {
        break;
      }
    }
    return left;
  };

  // factor := ('+' | '-') factor | '(' expression ')' | number
  const parseFactor = (): number => {
    const t = peek();
    if (t === undefined) throw new Error('unexpected end of input');
    if (t.kind === 'op' && (t.value === '+' || t.value === '-')) {
      pos++;
      const v = parseFactor();
      return t.value === '-' ? -v : v;
    }
    if (t.kind === 'lp') {
      pos++;
      const v = parseExpr();
      const close = peek();
      if (close === undefined || close.kind !== 'rp') throw new Error('missing )');
      pos++;
      return v;
    }
    if (t.kind === 'num') {
      pos++;
      return t.value;
    }
    throw new Error('unexpected token');
  };

  if (toks.length === 0) throw new Error('empty expression');
  const result = parseExpr();
  if (pos !== toks.length) throw new Error('unexpected trailing input');
  return result;
}
