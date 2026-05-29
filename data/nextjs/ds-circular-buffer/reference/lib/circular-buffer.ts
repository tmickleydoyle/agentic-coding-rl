export class RingBuffer<T> {
  private buf: Array<T | undefined>;
  private cap: number;
  private head = 0; // index of oldest element
  private count = 0;

  constructor(capacity: number) {
    if (capacity < 1 || !Number.isInteger(capacity)) {
      throw new RangeError('capacity must be a positive integer');
    }
    this.cap = capacity;
    this.buf = new Array<T | undefined>(capacity).fill(undefined);
  }

  push(value: T): void {
    const tail = (this.head + this.count) % this.cap;
    this.buf[tail] = value;
    if (this.count === this.cap) {
      // full: overwrite oldest, advance head
      this.head = (this.head + 1) % this.cap;
    } else {
      this.count++;
    }
  }

  shift(): T | undefined {
    if (this.count === 0) return undefined;
    const value = this.buf[this.head] as T;
    this.buf[this.head] = undefined;
    this.head = (this.head + 1) % this.cap;
    this.count--;
    return value;
  }

  peek(): T | undefined {
    if (this.count === 0) return undefined;
    return this.buf[this.head] as T;
  }

  toArray(): T[] {
    const out: T[] = [];
    for (let i = 0; i < this.count; i++) {
      out.push(this.buf[(this.head + i) % this.cap] as T);
    }
    return out;
  }

  size(): number {
    return this.count;
  }

  capacity(): number {
    return this.cap;
  }

  isFull(): boolean {
    return this.count === this.cap;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  clear(): void {
    this.buf.fill(undefined);
    this.head = 0;
    this.count = 0;
  }
}
