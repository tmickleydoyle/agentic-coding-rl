export class Fenwick {
  private n: number;
  // 1-indexed tree array of length n+1
  private tree: number[];

  constructor(n: number) {
    if (n < 0) throw new RangeError('n must be non-negative');
    this.n = n;
    this.tree = new Array<number>(n + 1).fill(0);
  }

  static fromArray(values: number[]): Fenwick {
    const f = new Fenwick(values.length);
    // O(n) build: tree[i] holds the running prefix contribution
    for (let i = 1; i <= values.length; i++) {
      f.tree[i] += values[i - 1];
      const parent = i + (i & -i);
      if (parent <= values.length) {
        f.tree[parent] += f.tree[i];
      }
    }
    return f;
  }

  update(i: number, delta: number): void {
    if (i < 0 || i >= this.n || !Number.isInteger(i)) {
      throw new RangeError(`index out of range: ${i}`);
    }
    let idx = i + 1;
    while (idx <= this.n) {
      this.tree[idx] += delta;
      idx += idx & -idx;
    }
  }

  prefixSum(i: number): number {
    if (i < 0) return 0;
    let idx = Math.min(i, this.n - 1) + 1;
    let sum = 0;
    while (idx > 0) {
      sum += this.tree[idx];
      idx -= idx & -idx;
    }
    return sum;
  }

  rangeSum(l: number, r: number): number {
    if (l > r) return 0;
    const lo = Math.max(l, 0);
    if (lo > this.n - 1) return 0;
    return this.prefixSum(r) - this.prefixSum(lo - 1);
  }

  size(): number {
    return this.n;
  }
}
