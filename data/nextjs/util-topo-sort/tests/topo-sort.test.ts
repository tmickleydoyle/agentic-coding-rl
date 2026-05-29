import { describe, it, expect } from 'vitest';
import { topoSort } from '../lib/topo-sort';

function isValidOrder(edges: Array<[string, string]>, order: string[]): boolean {
  const pos = new Map<string, number>();
  order.forEach((n, i) => pos.set(n, i));
  return edges.every(([u, v]) => (pos.get(u) as number) < (pos.get(v) as number));
}

describe('topoSort', () => {
  it('sorts a linear chain', () => {
    const order = topoSort([['a', 'b'], ['b', 'c'], ['c', 'd']]);
    expect(order).toEqual(['a', 'b', 'c', 'd']);
  });

  it('includes every node exactly once', () => {
    const order = topoSort([['a', 'b'], ['a', 'c'], ['b', 'd'], ['c', 'd']]);
    expect([...order].sort()).toEqual(['a', 'b', 'c', 'd']);
    expect(order.length).toBe(4);
  });

  it('produces a valid order for a diamond', () => {
    const edges: Array<[string, string]> = [
      ['a', 'b'], ['a', 'c'], ['b', 'd'], ['c', 'd'],
    ];
    expect(isValidOrder(edges, topoSort(edges))).toBe(true);
  });

  it('handles multiple independent chains', () => {
    const edges: Array<[string, string]> = [['a', 'b'], ['x', 'y']];
    const order = topoSort(edges);
    expect(isValidOrder(edges, order)).toBe(true);
    expect(order.length).toBe(4);
  });

  it('throws on a simple cycle', () => {
    expect(() => topoSort([['a', 'b'], ['b', 'a']])).toThrow('cycle');
  });

  it('throws on a self-edge', () => {
    expect(() => topoSort([['a', 'a']])).toThrow('cycle');
  });

  it('throws on a longer cycle embedded in a DAG', () => {
    expect(() =>
      topoSort([['a', 'b'], ['b', 'c'], ['c', 'a'], ['d', 'a']]),
    ).toThrow('cycle');
  });

  it('is deterministic for a given input', () => {
    const edges: Array<[string, string]> = [
      ['a', 'd'], ['b', 'd'], ['c', 'd'], ['e', 'f'],
    ];
    const a = topoSort(edges);
    const b = topoSort(edges);
    expect(a).toEqual(b);
  });

  it('emits ready nodes in first-seen order', () => {
    // c, a, b all in-degree 0; first seen order is c, a, b
    const order = topoSort([['c', 'z'], ['a', 'z'], ['b', 'z']]);
    expect(order).toEqual(['c', 'a', 'b', 'z']);
  });

  it('handles duplicate edges without breaking validity', () => {
    const edges: Array<[string, string]> = [['a', 'b'], ['a', 'b'], ['b', 'c']];
    const order = topoSort(edges);
    expect(isValidOrder([['a', 'b'], ['b', 'c']], order)).toBe(true);
    expect(order.length).toBe(3);
  });

  it('handles an empty edge list', () => {
    expect(topoSort([])).toEqual([]);
  });
});
