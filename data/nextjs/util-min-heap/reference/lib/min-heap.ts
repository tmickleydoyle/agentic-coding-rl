export type Comparator<T> = (a: T, b: T) => number;

function defaultCompare<T>(a: T, b: T): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export class MinHeap<T> {
  private data: T[] = [];
  private compare: Comparator<T>;

  constructor(compare?: Comparator<T>) {
    this.compare = compare ?? defaultCompare;
  }

  size(): number {
    return this.data.length;
  }

  peek(): T | undefined {
    return this.data.length > 0 ? this.data[0] : undefined;
  }

  private siftUp(i: number): void {
    const d = this.data;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(d[i], d[parent]) < 0) {
        const tmp = d[i];
        d[i] = d[parent];
        d[parent] = tmp;
        i = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(i: number): void {
    const d = this.data;
    const n = d.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      if (l < n && this.compare(d[l], d[smallest]) < 0) smallest = l;
      if (r < n && this.compare(d[r], d[smallest]) < 0) smallest = r;
      if (smallest === i) break;
      const tmp = d[i];
      d[i] = d[smallest];
      d[smallest] = tmp;
      i = smallest;
    }
  }

  push(value: T): void {
    this.data.push(value);
    this.siftUp(this.data.length - 1);
  }

  pop(): T | undefined {
    const d = this.data;
    if (d.length === 0) return undefined;
    const top = d[0];
    const last = d.pop() as T;
    if (d.length > 0) {
      d[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  static heapify<T>(values: T[], compare?: Comparator<T>): MinHeap<T> {
    const heap = new MinHeap<T>(compare);
    heap.data = values.slice();
    for (let i = (heap.data.length >> 1) - 1; i >= 0; i--) {
      heap.siftDown(i);
    }
    return heap;
  }
}

export function kSmallest<T>(arr: T[], k: number, compare?: Comparator<T>): T[] {
  if (k <= 0) return [];
  const heap = MinHeap.heapify(arr, compare);
  const limit = Math.min(k, arr.length);
  const out: T[] = [];
  for (let i = 0; i < limit; i++) {
    out.push(heap.pop() as T);
  }
  return out;
}
