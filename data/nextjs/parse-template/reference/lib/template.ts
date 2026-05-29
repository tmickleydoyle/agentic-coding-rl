type Node =
  | { type: 'text'; value: string }
  | { type: 'interp'; path: string; raw: boolean }
  | { type: 'if'; path: string; body: Node[] }
  | { type: 'each'; path: string; body: Node[] };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface Token {
  kind: 'text' | 'raw' | 'interp' | 'if' | 'each' | 'end';
  value: string;
}

function tokenize(tpl: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = tpl.length;
  while (i < n) {
    if (tpl.startsWith('{{{', i)) {
      const close = tpl.indexOf('}}}', i + 3);
      if (close === -1) throw new Error('unterminated {{{');
      tokens.push({ kind: 'raw', value: tpl.slice(i + 3, close).trim() });
      i = close + 3;
    } else if (tpl.startsWith('{{', i)) {
      const close = tpl.indexOf('}}', i + 2);
      if (close === -1) throw new Error('unterminated {{');
      const inner = tpl.slice(i + 2, close).trim();
      if (inner.startsWith('#if ')) {
        tokens.push({ kind: 'if', value: inner.slice(4).trim() });
      } else if (inner.startsWith('#each ')) {
        tokens.push({ kind: 'each', value: inner.slice(6).trim() });
      } else if (inner === '/if' || inner === '/each') {
        tokens.push({ kind: 'end', value: inner.slice(1) });
      } else {
        tokens.push({ kind: 'interp', value: inner });
      }
      i = close + 2;
    } else {
      const nextBrace = tpl.indexOf('{{', i);
      const end = nextBrace === -1 ? n : nextBrace;
      tokens.push({ kind: 'text', value: tpl.slice(i, end) });
      i = end;
    }
  }
  return tokens;
}

function parse(tokens: Token[]): Node[] {
  let pos = 0;

  function parseNodes(stopFor?: 'if' | 'each'): Node[] {
    const nodes: Node[] = [];
    while (pos < tokens.length) {
      const t = tokens[pos];
      if (t.kind === 'end') {
        if (stopFor === undefined) throw new Error(`unexpected {{/${t.value}}}`);
        if (t.value !== stopFor) {
          throw new Error(`mismatched closing tag {{/${t.value}}}`);
        }
        pos++; // consume end
        return nodes;
      }
      pos++;
      if (t.kind === 'text') {
        nodes.push({ type: 'text', value: t.value });
      } else if (t.kind === 'interp') {
        nodes.push({ type: 'interp', path: t.value, raw: false });
      } else if (t.kind === 'raw') {
        nodes.push({ type: 'interp', path: t.value, raw: true });
      } else if (t.kind === 'if') {
        const body = parseNodes('if');
        nodes.push({ type: 'if', path: t.value, body });
      } else if (t.kind === 'each') {
        const body = parseNodes('each');
        nodes.push({ type: 'each', path: t.value, body });
      }
    }
    if (stopFor !== undefined) {
      throw new Error(`missing closing {{/${stopFor}}}`);
    }
    return nodes;
  }

  return parseNodes();
}

const MISSING = Symbol('missing');

function resolve(path: string, ctx: unknown): unknown {
  if (path === 'this') return ctx;
  const segs = path.split('.');
  let cur: unknown = ctx;
  for (let k = 0; k < segs.length; k++) {
    const seg = segs[k];
    if (seg === 'this') {
      continue;
    }
    if (cur === null || cur === undefined) return MISSING;
    if (typeof cur !== 'object') return MISSING;
    const obj = cur as Record<string, unknown>;
    if (!(seg in obj) && !Array.isArray(cur)) return MISSING;
    cur = obj[seg];
    if (cur === undefined) return MISSING;
  }
  return cur;
}

function truthy(v: unknown): boolean {
  if (v === MISSING) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'number') return v !== 0 && !Number.isNaN(v);
  return Boolean(v);
}

function stringify(v: unknown): string {
  if (v === MISSING || v === null || v === undefined) return '';
  return String(v);
}

function renderNodes(nodes: Node[], ctx: unknown, index: number | null): string {
  let out = '';
  nodes.forEach((node) => {
    if (node.type === 'text') {
      out += node.value;
    } else if (node.type === 'interp') {
      let v: unknown;
      if (node.path === '@index') v = index;
      else v = resolve(node.path, ctx);
      const s = stringify(v);
      out += node.raw ? s : escapeHtml(s);
    } else if (node.type === 'if') {
      const v = resolve(node.path, ctx);
      if (truthy(v)) out += renderNodes(node.body, ctx, index);
    } else if (node.type === 'each') {
      const v = resolve(node.path, ctx);
      if (Array.isArray(v)) {
        v.forEach((item, idx) => {
          out += renderNodes(node.body, item, idx);
        });
      }
    }
  });
  return out;
}

export function render(tpl: string, data: unknown): string {
  const ast = parse(tokenize(tpl));
  return renderNodes(ast, data, null);
}
