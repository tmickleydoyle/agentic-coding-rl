export type Comparator<T> = (a: T, b: T) => number;

export class MinHeap<T> {
  constructor(compare?: Comparator<T>) {
    // TODO: implement
    void compare;
  }

  push(value: T): void {
    // TODO: implement
    void value;
    throw new Error('not implemented');
  }

  pop(): T | undefined {
    // TODO: implement
    throw new Error('not implemented');
  }

  peek(): T | undefined {
    // TODO: implement
    throw new Error('not implemented');
  }

  size(): number {
    // TODO: implement
    throw new Error('not implemented');
  }

  static heapify<T>(values: T[], compare?: Comparator<T>): MinHeap<T> {
    // TODO: implement
    void values;
    void compare;
    throw new Error('not implemented');
  }
}

export function kSmallest<T>(arr: T[], k: number, compare?: Comparator<T>): T[] {
  // TODO: implement
  void arr;
  void k;
  void compare;
  throw new Error('not implemented');
}
