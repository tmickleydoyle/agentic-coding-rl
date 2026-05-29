export interface CompiledRoute {
  match(path: string): Record<string, string> | null;
}

type Segment =
  | { kind: 'static'; value: string }
  | { kind: 'param'; name: string }
  | { kind: 'optional'; name: string }
  | { kind: 'wildcard'; name: string };

function splitPath(p: string): string[] {
  let s = p;
  if (s.startsWith('/')) s = s.slice(1);
  if (s.endsWith('/')) s = s.slice(0, -1);
  if (s === '') return [];
  return s.split('/');
}

function parsePattern(pattern: string): Segment[] {
  const raw = splitPath(pattern);
  return raw.map((seg, idx) => {
    if (seg.startsWith(':')) {
      const body = seg.slice(1);
      if (body.endsWith('*')) {
        if (idx !== raw.length - 1) {
          throw new Error('wildcard tail must be the last segment');
        }
        return { kind: 'wildcard', name: body.slice(0, -1) };
      }
      if (body.endsWith('?')) {
        return { kind: 'optional', name: body.slice(0, -1) };
      }
      return { kind: 'param', name: body };
    }
    return { kind: 'static', value: seg };
  });
}

export function compile(pattern: string): CompiledRoute {
  const segments = parsePattern(pattern);

  return {
    match(path: string): Record<string, string> | null {
      const parts = splitPath(path);
      const params: Record<string, string> = {};
      let pi = 0; // path index

      for (let si = 0; si < segments.length; si++) {
        const seg = segments[si];
        if (seg.kind === 'wildcard') {
          const rest = parts.slice(pi);
          params[seg.name] = rest.map((s) => decodeURIComponent(s)).join('/');
          pi = parts.length;
          continue;
        }
        if (seg.kind === 'optional') {
          // Optional only consumes if a part is available AND consuming it can
          // still let the remaining required pattern segments match. Since
          // optionals here are simple, greedily consume when remaining path
          // length matches remaining pattern needs.
          const remainingPattern = segments.length - si;
          const remainingPath = parts.length - pi;
          if (remainingPath >= remainingPattern && pi < parts.length) {
            params[seg.name] = decodeURIComponent(parts[pi]);
            pi++;
          }
          // else: skip, param omitted
          continue;
        }
        // static or required param needs a present segment
        if (pi >= parts.length) return null;
        if (seg.kind === 'static') {
          if (parts[pi] !== seg.value) return null;
          pi++;
        } else {
          // param
          params[seg.name] = decodeURIComponent(parts[pi]);
          pi++;
        }
      }

      if (pi !== parts.length) return null;
      return params;
    },
  };
}

export function match(
  pattern: string,
  path: string,
): Record<string, string> | null {
  return compile(pattern).match(path);
}
