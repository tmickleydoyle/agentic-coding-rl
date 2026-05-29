export class DSU {
  private parent: number[];
  private rank: number[];
  private n: number;
  private components: number;

  constructor(n: number) {
    if (n < 0) throw new RangeError('n must be non-negative');
    this.n = n;
    this.components = n;
    this.parent = new Array<number>(n);
    this.rank = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
      this.rank[i] = 0;
    }
  }

  private check(x: number): void {
    if (x < 0 || x >= this.n || !Number.isInteger(x)) {
      throw new RangeError(`index out of range: ${x}`);
    }
  }

  find(x: number): number {
    this.check(x);
    let root = x;
    while (this.parent[root] !== root) {
      root = this.parent[root];
    }
    // path compression
    let cur = x;
    while (this.parent[cur] !== root) {
      const next = this.parent[cur];
      this.parent[cur] = root;
      cur = next;
    }
    return root;
  }

  union(a: number, b: number): boolean {
    this.check(a);
    this.check(b);
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra] < this.rank[rb]) {
      this.parent[ra] = rb;
    } else if (this.rank[ra] > this.rank[rb]) {
      this.parent[rb] = ra;
    } else {
      this.parent[rb] = ra;
      this.rank[ra]++;
    }
    this.components--;
    return true;
  }

  connected(a: number, b: number): boolean {
    this.check(a);
    this.check(b);
    return this.find(a) === this.find(b);
  }

  count(): number {
    return this.components;
  }
}
