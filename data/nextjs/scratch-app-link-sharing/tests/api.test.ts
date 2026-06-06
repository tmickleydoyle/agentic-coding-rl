import { describe, it, expect, beforeEach } from 'vitest';
import { __reset, getLinks, createLink, upvoteLink, addComment } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Link Sharing API (store layer)', () => {
  it('getLinks returns 3 seed links', () => {
    expect(getLinks().length).toBe(3);
  });

  it('getLinks sorted by upvotes desc', () => {
    const links = getLinks();
    expect(links[0].upvotes).toBeGreaterThanOrEqual(links[1].upvotes);
  });

  it('createLink adds new link', () => {
    createLink({ title: 'X', url: 'https://x.com', submitter: 'dave', category: 'Other' });
    expect(getLinks().length).toBe(4);
  });

  it('upvoteLink increments by 1', () => {
    const before = getLinks().find((l) => l.id === 'l1')!.upvotes;
    const after = upvoteLink('l1');
    expect(after).toBe(before + 1);
  });

  it('upvoteLink on unknown id returns null', () => {
    expect(upvoteLink('unknown')).toBeNull();
  });

  it('addComment appends comment to link', () => {
    addComment('l2', { author: 'dave', body: 'Cool' });
    const link = getLinks().find((l) => l.id === 'l2')!;
    expect(link.comments.length).toBe(1);
  });

  it('addComment on unknown link returns null', () => {
    expect(addComment('unknown', { author: 'x', body: 'y' })).toBeNull();
  });
});
