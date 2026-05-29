export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[];
}

const NUM = /^(0|[1-9][0-9]*)$/;

function parseNumeric(part: string): number {
  if (!NUM.test(part)) throw new Error(`invalid version part: ${part}`);
  return Number(part);
}

export function parse(v: string): SemVer {
  let s = v.trim();
  if (s.startsWith('v')) s = s.slice(1);
  // strip build metadata
  const plus = s.indexOf('+');
  if (plus !== -1) s = s.slice(0, plus);
  let prerelease: string[] = [];
  const dash = s.indexOf('-');
  if (dash !== -1) {
    const pre = s.slice(dash + 1);
    s = s.slice(0, dash);
    if (pre === '') throw new Error('empty prerelease');
    prerelease = pre.split('.');
    prerelease.forEach((id) => {
      if (id === '') throw new Error('empty prerelease identifier');
    });
  }
  const parts = s.split('.');
  if (parts.length !== 3) throw new Error(`invalid version: ${v}`);
  return {
    major: parseNumeric(parts[0]),
    minor: parseNumeric(parts[1]),
    patch: parseNumeric(parts[2]),
    prerelease,
  };
}

function cmpPrerelease(a: string[], b: string[]): -1 | 0 | 1 {
  // No prerelease has higher precedence.
  if (a.length === 0 && b.length === 0) return 0;
  if (a.length === 0) return 1;
  if (b.length === 0) return -1;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const ai = a[i];
    const bi = b[i];
    const aNum = NUM.test(ai);
    const bNum = NUM.test(bi);
    if (aNum && bNum) {
      const x = Number(ai);
      const y = Number(bi);
      if (x < y) return -1;
      if (x > y) return 1;
    } else if (aNum && !bNum) {
      return -1; // numeric < non-numeric
    } else if (!aNum && bNum) {
      return 1;
    } else {
      if (ai < bi) return -1;
      if (ai > bi) return 1;
    }
  }
  if (a.length < b.length) return -1;
  if (a.length > b.length) return 1;
  return 0;
}

function cmpParsed(a: SemVer, b: SemVer): -1 | 0 | 1 {
  if (a.major !== b.major) return a.major < b.major ? -1 : 1;
  if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1;
  if (a.patch !== b.patch) return a.patch < b.patch ? -1 : 1;
  return cmpPrerelease(a.prerelease, b.prerelease);
}

export function compare(a: string, b: string): -1 | 0 | 1 {
  return cmpParsed(parse(a), parse(b));
}

interface Comparator {
  op: '<' | '<=' | '>' | '>=' | '=';
  ver: SemVer;
}

function makeVer(major: number, minor: number, patch: number): SemVer {
  return { major, minor, patch, prerelease: [] };
}

function expandComparator(token: string): Comparator[] {
  if (token === '*' || token === 'x' || token === 'X' || token === '') {
    return [{ op: '>=', ver: makeVer(0, 0, 0) }];
  }

  let op = '';
  let rest = token;
  const m = /^(>=|<=|>|<|=|\^|~)/.exec(token);
  if (m) {
    op = m[1];
    rest = token.slice(m[1].length);
  }

  // Handle wildcards / partial versions in `rest`.
  const segs = rest.split('.');
  const hasWild = segs.some((p) => p === 'x' || p === 'X' || p === '*');
  const partial = segs.length < 3;

  if (op === '^') {
    const v = parse(rest);
    let upper: SemVer;
    if (v.major > 0) upper = makeVer(v.major + 1, 0, 0);
    else if (v.minor > 0) upper = makeVer(0, v.minor + 1, 0);
    else upper = makeVer(0, 0, v.patch + 1);
    return [
      { op: '>=', ver: v },
      { op: '<', ver: upper },
    ];
  }

  if (op === '~') {
    const major = parseInt(segs[0], 10);
    const minor = segs.length > 1 ? parseInt(segs[1], 10) : 0;
    const patch = segs.length > 2 ? parseInt(segs[2], 10) : 0;
    return [
      { op: '>=', ver: makeVer(major, minor, patch) },
      { op: '<', ver: makeVer(major, minor + 1, 0) },
    ];
  }

  if ((hasWild || partial) && (op === '' || op === '=')) {
    // bare wildcard / partial -> range
    const major = parseInt(segs[0], 10);
    if (segs.length === 1 || segs[1] === 'x' || segs[1] === 'X' || segs[1] === '*') {
      return [
        { op: '>=', ver: makeVer(major, 0, 0) },
        { op: '<', ver: makeVer(major + 1, 0, 0) },
      ];
    }
    const minor = parseInt(segs[1], 10);
    // patch wild or missing
    return [
      { op: '>=', ver: makeVer(major, minor, 0) },
      { op: '<', ver: makeVer(major, minor + 1, 0) },
    ];
  }

  const ver = parse(rest);
  const realOp = (op === '' ? '=' : op) as Comparator['op'];
  return [{ op: realOp, ver }];
}

function testComparator(version: SemVer, c: Comparator): boolean {
  const r = cmpParsed(version, c.ver);
  switch (c.op) {
    case '<':
      return r < 0;
    case '<=':
      return r <= 0;
    case '>':
      return r > 0;
    case '>=':
      return r >= 0;
    case '=':
      return r === 0;
  }
}

export function satisfies(version: string, range: string): boolean {
  const v = parse(version);
  const tokens = range.trim().split(/\s+/).filter((t) => t !== '');
  const comparators: Comparator[] = [];
  tokens.forEach((t) => {
    expandComparator(t).forEach((c) => comparators.push(c));
  });
  if (comparators.length === 0) return true;

  // Prerelease handling: only allow when a comparator names the same
  // major.minor.patch tuple.
  if (v.prerelease.length > 0) {
    const allowed = comparators.some(
      (c) =>
        c.ver.major === v.major &&
        c.ver.minor === v.minor &&
        c.ver.patch === v.patch &&
        c.ver.prerelease.length >= 0 &&
        // require comparator carried an explicit prerelease tuple OR same triple
        true,
    );
    if (!allowed) return false;
  }

  return comparators.every((c) => testComparator(v, c));
}
