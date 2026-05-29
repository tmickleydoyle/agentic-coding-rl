function isNumberToken(t: string): boolean {
  if (t.trim() === '') return false;
  const n = Number(t);
  return Number.isFinite(n);
}

export function evalRPN(tokens: string[]): number {
  const stack: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (isNumberToken(t)) {
      stack.push(Number(t));
      continue;
    }
    if (t === 'neg') {
      if (stack.length < 1) throw new Error('stack underflow');
      stack.push(-(stack.pop() as number));
      continue;
    }
    if (t === '+' || t === '-' || t === '*' || t === '/') {
      if (stack.length < 2) throw new Error('stack underflow');
      const b = stack.pop() as number;
      const a = stack.pop() as number;
      let r: number;
      if (t === '+') r = a + b;
      else if (t === '-') r = a - b;
      else if (t === '*') r = a * b;
      else {
        if (b === 0) throw new Error('division by zero');
        r = a / b;
      }
      stack.push(r);
      continue;
    }
    throw new Error(`unknown token: ${t}`);
  }
  if (stack.length !== 1) throw new Error('invalid expression');
  return stack[0];
}

function precedence(op: string): number {
  if (op === '+' || op === '-') return 1;
  return 2; // * /
}

export function infixToRPN(expr: string): string[] {
  const tokens = expr.split(/\s+/).filter((t) => t.length > 0);
  const out: string[] = [];
  const ops: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (isNumberToken(t)) {
      out.push(t);
    } else if (t === '+' || t === '-' || t === '*' || t === '/') {
      while (
        ops.length > 0 &&
        (ops[ops.length - 1] === '+' ||
          ops[ops.length - 1] === '-' ||
          ops[ops.length - 1] === '*' ||
          ops[ops.length - 1] === '/') &&
        precedence(ops[ops.length - 1]) >= precedence(t)
      ) {
        out.push(ops.pop() as string);
      }
      ops.push(t);
    } else if (t === '(') {
      ops.push(t);
    } else if (t === ')') {
      let found = false;
      while (ops.length > 0) {
        const top = ops.pop() as string;
        if (top === '(') {
          found = true;
          break;
        }
        out.push(top);
      }
      if (!found) throw new Error('mismatched parentheses');
    } else {
      throw new Error(`unknown token: ${t}`);
    }
  }
  while (ops.length > 0) {
    const top = ops.pop() as string;
    if (top === '(' || top === ')') throw new Error('mismatched parentheses');
    out.push(top);
  }
  return out;
}
