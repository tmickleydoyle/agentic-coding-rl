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

export function diff(a: Json, b: Json): Op[] {
  // TODO: implement
  void a;
  void b;
  throw new Error('not implemented');
}

export function apply<T extends Json>(doc: T, ops: Op[]): Json {
  // TODO: implement
  void doc;
  void ops;
  throw new Error('not implemented');
}
