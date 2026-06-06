export interface Queue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  front(): T | undefined;
  isEmpty(): boolean;
  size(): number;
  toArray(): T[];
  clear(): void;
}

export function createQueue<T>(): Queue<T> {
  throw new Error('not implemented');
}

export function movingAverage(nums: number[], windowSize: number): number[] {
  throw new Error('not implemented');
}
