type SExpr = string | SExpr[];

function tokenize(src: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '(' || c === ')') {
      tokens.push(c);
      i++;
    } else if (/\s/.test(c)) {
      i++;
    } else {
      let j = i;
      while (j < src.length && !/\s/.test(src[j]) && src[j] !== '(' && src[j] !== ')') {
        j++;
      }
      tokens.push(src.slice(i, j));
      i = j;
    }
  }
  return tokens;
}

function parse(tokens: string[]): SExpr {
  let pos = 0;
  const parseExpr = (): SExpr => {
    if (pos >= tokens.length) throw new Error('unexpected end of input');
    const tok = tokens[pos++];
    if (tok === '(') {
      const list: SExpr[] = [];
      while (pos < tokens.length && tokens[pos] !== ')') {
        list.push(parseExpr());
      }
      if (pos >= tokens.length) throw new Error('unbalanced parentheses');
      pos++; // consume ')'
      return list;
    }
    if (tok === ')') throw new Error('unexpected )');
    return tok;
  };

  if (tokens.length === 0) throw new Error('empty expression');
  const expr = parseExpr();
  if (pos !== tokens.length) throw new Error('trailing tokens');
  return expr;
}

type Env = Map<string, number | boolean>;

function asNumber(v: number | boolean): number {
  if (typeof v !== 'number') throw new Error('expected a number');
  return v;
}

function asBoolean(v: number | boolean): boolean {
  if (typeof v !== 'boolean') throw new Error('expected a boolean');
  return v;
}

function isIntLiteral(tok: string): boolean {
  return /^-?\d+$/.test(tok);
}

function evalExpr(expr: SExpr, env: Env): number | boolean {
  if (typeof expr === 'string') {
    if (isIntLiteral(expr)) return Number(expr);
    if (env.has(expr)) return env.get(expr) as number | boolean;
    throw new Error(`unbound symbol: ${expr}`);
  }

  if (expr.length === 0) throw new Error('cannot evaluate empty list');
  const head = expr[0];
  if (typeof head !== 'string') throw new Error('head must be a symbol');
  const args = expr.slice(1);

  if (head === '+' || head === '-' || head === '*' || head === '/') {
    if (args.length === 0) throw new Error(`${head} needs at least one argument`);
    const nums = args.map((a) => asNumber(evalExpr(a, env)));
    let acc = nums[0];
    for (let k = 1; k < nums.length; k++) {
      const n = nums[k];
      if (head === '+') acc += n;
      else if (head === '-') acc -= n;
      else if (head === '*') acc *= n;
      else {
        if (n === 0) throw new Error('division by zero');
        acc /= n;
      }
    }
    return acc;
  }

  if (head === '<' || head === '>' || head === '=') {
    if (args.length !== 2) throw new Error(`${head} needs exactly two arguments`);
    const a = asNumber(evalExpr(args[0], env));
    const b = asNumber(evalExpr(args[1], env));
    if (head === '<') return a < b;
    if (head === '>') return a > b;
    return a === b;
  }

  if (head === 'if') {
    if (args.length !== 3) throw new Error('if needs exactly three arguments');
    const cond = asBoolean(evalExpr(args[0], env));
    return evalExpr(cond ? args[1] : args[2], env);
  }

  if (head === 'let') {
    if (args.length !== 2) throw new Error('let needs bindings and a body');
    const bindings = args[0];
    if (!Array.isArray(bindings)) throw new Error('let bindings must be a list');
    const next: Env = new Map(env);
    for (let k = 0; k < bindings.length; k++) {
      const pair = bindings[k];
      if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== 'string') {
        throw new Error('malformed let binding');
      }
      // bind value evaluated in the OUTER scope
      next.set(pair[0], evalExpr(pair[1], env));
    }
    return evalExpr(args[1], next);
  }

  throw new Error(`unknown function: ${head}`);
}

export function evalLisp(src: string): number | boolean {
  const tokens = tokenize(src);
  const ast = parse(tokens);
  return evalExpr(ast, new Map());
}
