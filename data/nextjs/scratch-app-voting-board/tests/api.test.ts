import { describe, it, expect, beforeEach } from 'vitest';
import { __reset, getProposals, createProposal, upvote, downvote } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Voting Board API (store layer)', () => {
  it('getProposals returns 4 seed proposals', () => {
    expect(getProposals().length).toBe(4);
  });

  it('getProposals sorted by score desc', () => {
    const props = getProposals();
    for (let i = 0; i < props.length - 1; i++) {
      const scoreA = props[i].upvotes - props[i].downvotes;
      const scoreB = props[i + 1].upvotes - props[i + 1].downvotes;
      expect(scoreA).toBeGreaterThanOrEqual(scoreB);
    }
  });

  it('createProposal creates with 0 votes', () => {
    const p = createProposal({ title: 'X', description: 'Y', author: 'z', category: 'Feature' });
    expect(p.upvotes).toBe(0);
    expect(p.downvotes).toBe(0);
  });

  it('upvote increments upvotes', () => {
    upvote('pr1');
    const p = getProposals().find((p) => p.id === 'pr1')!;
    expect(p.upvotes).toBe(16);
  });

  it('downvote on closed proposal returns error', () => {
    const r = downvote('pr3');
    expect(r.error).toBe('Proposal is closed');
    expect(r.status).toBe(400);
  });

  it('upvote on unknown returns 404', () => {
    const r = upvote('unknown');
    expect(r.status).toBe(404);
  });

  it('downvote increments downvotes', () => {
    downvote('pr2');
    const p = getProposals().find((p) => p.id === 'pr2')!;
    expect(p.downvotes).toBe(2);
  });
});
