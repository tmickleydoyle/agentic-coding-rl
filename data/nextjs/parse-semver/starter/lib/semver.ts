export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[];
}

export function parse(v: string): SemVer {
  // TODO: implement
  void v;
  throw new Error('not implemented');
}

export function compare(a: string, b: string): -1 | 0 | 1 {
  // TODO: implement
  void a;
  void b;
  throw new Error('not implemented');
}

export function satisfies(version: string, range: string): boolean {
  // TODO: implement
  void version;
  void range;
  throw new Error('not implemented');
}
