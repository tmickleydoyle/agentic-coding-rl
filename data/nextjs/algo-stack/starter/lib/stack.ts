export interface Stack<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  isEmpty(): boolean;
  size(): number;
  toArray(): T[];
  clear(): void;
}

export function createStack<T>(): Stack<T> {
  throw new Error('not implemented');
}

export function isBalanced(s: string): boolean {
  throw new Error('not implemented');
}
