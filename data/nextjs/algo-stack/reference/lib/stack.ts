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
  const items: T[] = [];
  return {
    push(item: T): void {
      items.push(item);
    },
    pop(): T | undefined {
      return items.pop();
    },
    peek(): T | undefined {
      return items[items.length - 1];
    },
    isEmpty(): boolean {
      return items.length === 0;
    },
    size(): number {
      return items.length;
    },
    toArray(): T[] {
      return items.slice();
    },
    clear(): void {
      items.length = 0;
    },
  };
}

const PAIRS: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
const OPENERS = new Set(['(', '[', '{']);

export function isBalanced(s: string): boolean {
  const stack = createStack<string>();
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (OPENERS.has(ch)) {
      stack.push(ch);
    } else {
      if (stack.pop() !== PAIRS[ch]) return false;
    }
  }
  return stack.isEmpty();
}
