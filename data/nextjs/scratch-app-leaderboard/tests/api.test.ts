import { describe, it, expect, beforeEach } from 'vitest';
import { __reset, getScores, submitScore, getScore } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Leaderboard API (store layer)', () => {
  it('getScores returns 5 seed scores', () => {
    expect(getScores().length).toBe(5);
  });

  it('getScores sorted newest first', () => {
    const scores = getScores();
    expect(scores[0].id).toBe('s5');
  });

  it('submitScore adds a score', () => {
    submitScore({ player: 'dave', game: 'Puzzle', score: 700 });
    expect(getScores().length).toBe(6);
  });

  it('getScore returns correct entry', () => {
    const s = getScore('s1');
    expect(s?.player).toBe('alice');
    expect(s?.score).toBe(1200);
  });

  it('getScore returns undefined for unknown id', () => {
    expect(getScore('unknown')).toBeUndefined();
  });

  it('submitScore assigns unique ids', () => {
    const a = submitScore({ player: 'x', game: 'Chess', score: 100 });
    const b = submitScore({ player: 'y', game: 'Chess', score: 200 });
    expect(a.id).not.toBe(b.id);
  });
});
