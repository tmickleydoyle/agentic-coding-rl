export type Op =
  | { type: 'insert'; index: number; char: string }
  | { type: 'delete'; index: number; char: string }
  | { type: 'substitute'; index: number; from: string; to: string };

export function levenshtein(a: string, b: string): number {
  // TODO: implement
  void a;
  void b;
  throw new Error('not implemented');
}

export function editScript(a: string, b: string): Op[] {
  // TODO: implement
  void a;
  void b;
  throw new Error('not implemented');
}

export function applyScript(a: string, ops: Op[]): string {
  // TODO: implement
  void a;
  void ops;
  throw new Error('not implemented');
}
