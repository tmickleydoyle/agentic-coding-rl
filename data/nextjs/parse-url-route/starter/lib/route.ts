export interface CompiledRoute {
  match(path: string): Record<string, string> | null;
}

export function compile(pattern: string): CompiledRoute {
  // TODO: implement
  void pattern;
  throw new Error('not implemented');
}

export function match(
  pattern: string,
  path: string,
): Record<string, string> | null {
  // TODO: implement using compile
  void pattern;
  void path;
  throw new Error('not implemented');
}
