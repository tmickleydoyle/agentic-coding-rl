import { describe, it, expect } from 'vitest';
import { dijkstra, shortestPath, type Graph } from '../lib/dijkstra';

describe('dijkstra', () => {
  it('start node has distance 0 and null predecessor', () => {
    const g: Graph = { a: [['b', 5]], b: [] };
    const { dist, prev } = dijkstra(g, 'a');
    expect(dist.a).toBe(0);
    expect(prev.a).toBeNull();
  });

  it('computes shortest distances on a simple chain', () => {
    const g: Graph = { a: [['b', 1]], b: [['c', 2]], c: [] };
    const { dist } = dijkstra(g, 'a');
    expect(dist).toEqual({ a: 0, b: 1, c: 3 });
  });

  it('prefers the cheaper of two routes', () => {
    const g: Graph = {
      a: [['b', 1], ['c', 4]],
      b: [['c', 1]],
      c: [],
    };
    const { dist, prev } = dijkstra(g, 'a');
    expect(dist.c).toBe(2);
    expect(prev.c).toBe('b');
  });

  it('does not include unreachable nodes in dist', () => {
    const g: Graph = { a: [['b', 1]], b: [], island: [['x', 1]], x: [] };
    const { dist } = dijkstra(g, 'a');
    expect(dist).toEqual({ a: 0, b: 1 });
    expect('island' in dist).toBe(false);
    expect('x' in dist).toBe(false);
  });

  it('a self-loop does not loop forever and keeps start at 0', () => {
    const g: Graph = { a: [['a', 3], ['b', 2]], b: [] };
    const { dist } = dijkstra(g, 'a');
    expect(dist.a).toBe(0);
    expect(dist.b).toBe(2);
  });

  it('handles a node that only appears as a neighbor', () => {
    const g: Graph = { a: [['b', 7]] }; // b has no own key
    const { dist } = dijkstra(g, 'a');
    expect(dist.b).toBe(7);
  });

  it('reconstructs the shortest path', () => {
    const g: Graph = {
      a: [['b', 1], ['c', 4]],
      b: [['c', 1], ['d', 5]],
      c: [['d', 1]],
      d: [],
    };
    expect(shortestPath(g, 'a', 'd')).toEqual(['a', 'b', 'c', 'd']);
  });

  it('shortestPath to itself is just the start', () => {
    const g: Graph = { a: [['b', 1]], b: [] };
    expect(shortestPath(g, 'a', 'a')).toEqual(['a']);
  });

  it('shortestPath returns [] when the target is unreachable', () => {
    const g: Graph = { a: [['b', 1]], b: [], z: [] };
    expect(shortestPath(g, 'a', 'z')).toEqual([]);
  });

  it('handles an undirected diamond with a tie via both branches summing equal', () => {
    const g: Graph = {
      s: [['a', 2], ['b', 2]],
      a: [['t', 3]],
      b: [['t', 3]],
      t: [],
    };
    const { dist } = dijkstra(g, 's');
    expect(dist.t).toBe(5);
    const path = shortestPath(g, 's', 't');
    expect(path[0]).toBe('s');
    expect(path[path.length - 1]).toBe('t');
    expect(path.length).toBe(3);
  });

  it('zero-weight edges are handled', () => {
    const g: Graph = { a: [['b', 0]], b: [['c', 0]], c: [] };
    const { dist } = dijkstra(g, 'a');
    expect(dist).toEqual({ a: 0, b: 0, c: 0 });
  });
});
