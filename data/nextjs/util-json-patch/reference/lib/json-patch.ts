export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

export interface Op {
  op: 'add' | 'remove' | 'replace';
  path: string;
  value?: Json;
}

function isObject(v: Json): v is { [key: string]: Json } {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function clone(v: Json): Json {
  if (Array.isArray(v)) return v.map(clone);
  if (isObject(v)) {
    const out: { [key: string]: Json } = {};
    Object.keys(v).forEach((k) => {
      out[k] = clone(v[k]);
    });
    return out;
  }
  return v;
}

function deepEqual(a: Json, b: Json): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (isObject(a) && isObject(b)) {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (let i = 0; i < ka.length; i++) {
      const k = ka[i];
      if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
      if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
  }
  return false;
}

function parsePath(path: string): string[] {
  if (path === '') return [];
  // leading slash then slash-separated tokens
  return path.slice(1).split('/');
}

export function apply<T extends Json>(doc: T, ops: Op[]): Json {
  let root: Json = clone(doc);

  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const tokens = parsePath(op.path);

    if (tokens.length === 0) {
      // operate on the whole document
      if (op.op === 'add' || op.op === 'replace') {
        root = clone(op.value as Json);
        continue;
      }
      throw new Error('cannot remove root');
    }

    // navigate to the parent container
    let parent: Json = root;
    for (let t = 0; t < tokens.length - 1; t++) {
      const key = tokens[t];
      if (Array.isArray(parent)) {
        const idx = Number(key);
        if (!Number.isInteger(idx) || idx < 0 || idx >= parent.length) {
          throw new Error(`path not found: ${op.path}`);
        }
        parent = parent[idx];
      } else if (isObject(parent)) {
        if (!Object.prototype.hasOwnProperty.call(parent, key)) {
          throw new Error(`path not found: ${op.path}`);
        }
        parent = parent[key];
      } else {
        throw new Error(`path not found: ${op.path}`);
      }
    }

    const last = tokens[tokens.length - 1];

    if (Array.isArray(parent)) {
      const arr = parent;
      if (op.op === 'add') {
        if (last === '-') {
          arr.push(clone(op.value as Json));
        } else {
          const idx = Number(last);
          if (!Number.isInteger(idx) || idx < 0 || idx > arr.length) {
            throw new Error(`bad array index: ${op.path}`);
          }
          arr.splice(idx, 0, clone(op.value as Json));
        }
      } else {
        const idx = Number(last);
        if (!Number.isInteger(idx) || idx < 0 || idx >= arr.length) {
          throw new Error(`path not found: ${op.path}`);
        }
        if (op.op === 'remove') {
          arr.splice(idx, 1);
        } else {
          arr[idx] = clone(op.value as Json);
        }
      }
    } else if (isObject(parent)) {
      const obj = parent;
      if (op.op === 'add' || op.op === 'replace') {
        if (op.op === 'replace' && !Object.prototype.hasOwnProperty.call(obj, last)) {
          throw new Error(`path not found: ${op.path}`);
        }
        obj[last] = clone(op.value as Json);
      } else {
        if (!Object.prototype.hasOwnProperty.call(obj, last)) {
          throw new Error(`path not found: ${op.path}`);
        }
        delete obj[last];
      }
    } else {
      throw new Error(`path not found: ${op.path}`);
    }
  }

  return root;
}

export function diff(a: Json, b: Json): Op[] {
  const ops: Op[] = [];

  const walk = (av: Json, bv: Json, path: string): void => {
    if (deepEqual(av, bv)) return;

    if (isObject(av) && isObject(bv)) {
      const aKeys = Object.keys(av);
      const bKeys = Object.keys(bv);
      // removals first (so indices/keys stay stable), then adds/replaces
      for (let i = 0; i < aKeys.length; i++) {
        const k = aKeys[i];
        if (!Object.prototype.hasOwnProperty.call(bv, k)) {
          ops.push({ op: 'remove', path: `${path}/${k}` });
        }
      }
      for (let i = 0; i < bKeys.length; i++) {
        const k = bKeys[i];
        if (!Object.prototype.hasOwnProperty.call(av, k)) {
          ops.push({ op: 'add', path: `${path}/${k}`, value: clone(bv[k]) });
        } else {
          walk(av[k], bv[k], `${path}/${k}`);
        }
      }
      return;
    }

    if (Array.isArray(av) && Array.isArray(bv)) {
      const common = Math.min(av.length, bv.length);
      for (let i = 0; i < common; i++) {
        walk(av[i], bv[i], `${path}/${i}`);
      }
      // remove extras from the tail (highest index first)
      for (let i = av.length - 1; i >= common; i--) {
        ops.push({ op: 'remove', path: `${path}/${i}` });
      }
      // append new tail items
      for (let i = common; i < bv.length; i++) {
        ops.push({ op: 'add', path: `${path}/-`, value: clone(bv[i]) });
      }
      return;
    }

    // type change or primitive change
    ops.push({ op: 'replace', path, value: clone(bv) });
  };

  walk(a, b, '');
  return ops;
}
