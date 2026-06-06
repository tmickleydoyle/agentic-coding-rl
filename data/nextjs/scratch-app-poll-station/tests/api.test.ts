import { describe, it, expect, beforeEach } from 'vitest';
import { __reset, getPolls, createPoll, vote, closePoll } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Poll Station API (store layer)', () => {
  it('getPolls returns 3 polls', () => {
    expect(getPolls().length).toBe(3);
  });

  it('createPoll creates poll with options', () => {
    const p = createPoll({ question: 'Q', creator: 'x', options: ['A', 'B'] });
    expect(p.options.length).toBe(2);
    expect(p.status).toBe('open');
  });

  it('vote increments option votes', () => {
    vote('p1', 'o1');
    const p = getPolls().find((p) => p.id === 'p1')!;
    expect(p.options.find((o) => o.id === 'o1')!.votes).toBe(6);
  });

  it('vote on closed poll returns error', () => {
    const result = vote('p3', 'o7');
    expect(result.error).toBe('Poll is closed');
    expect(result.status).toBe(400);
  });

  it('vote on unknown poll returns 404', () => {
    const result = vote('unknown', 'o1');
    expect(result.status).toBe(404);
  });

  it('vote on unknown option returns 404', () => {
    const result = vote('p1', 'unknown-option');
    expect(result.status).toBe(404);
  });

  it('closePoll sets status to closed', () => {
    closePoll('p1');
    const p = getPolls().find((p) => p.id === 'p1')!;
    expect(p.status).toBe('closed');
  });

  it('closePoll on unknown id returns null', () => {
    expect(closePoll('unknown')).toBeNull();
  });
});
