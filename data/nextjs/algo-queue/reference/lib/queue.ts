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
  const items: T[] = [];
  return {
    enqueue(item: T): void {
      items.push(item);
    },
    dequeue(): T | undefined {
      return items.shift();
    },
    front(): T | undefined {
      return items[0];
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

export function movingAverage(nums: number[], windowSize: number): number[] {
  if (windowSize <= 0) throw new RangeError('windowSize must be positive');
  if (nums.length === 0) return [];
  const result: number[] = [];
  const queue = createQueue<number>();
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    queue.enqueue(nums[i]);
    sum += nums[i];
    if (queue.size() > windowSize) {
      const removed = queue.dequeue()!;
      sum -= removed;
    }
    const avg = sum / queue.size();
    result.push(parseFloat(avg.toFixed(6)));
  }
  return result;
}
