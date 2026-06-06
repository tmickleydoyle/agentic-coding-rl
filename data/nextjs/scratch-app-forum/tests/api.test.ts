import { describe, it, expect, beforeEach } from 'vitest';
import { __reset, getThreads, createThread, upvoteThread, addReply } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Forum API (store layer)', () => {
  it('getThreads returns 3 seed threads', () => {
    expect(getThreads().length).toBe(3);
  });

  it('getThreads returns newest first', () => {
    const threads = getThreads();
    expect(threads[0].id).toBe('t3');
    expect(threads[2].id).toBe('t1');
  });

  it('createThread adds a thread', () => {
    createThread({ title: 'New', body: 'Body', author: 'dave', category: 'General' });
    expect(getThreads().length).toBe(4);
  });

  it('created thread has zero upvotes and empty replies', () => {
    const t = createThread({ title: 'A', body: 'B', author: 'x', category: 'Tech' });
    expect(t.upvotes).toBe(0);
    expect(t.replies.length).toBe(0);
  });

  it('upvoteThread increments by 1', () => {
    const before = getThreads().find((t) => t.id === 't2')!.upvotes;
    const after = upvoteThread('t2');
    expect(after).toBe(before + 1);
  });

  it('upvoteThread on unknown id returns null', () => {
    expect(upvoteThread('unknown')).toBeNull();
  });

  it('addReply appends reply to thread', () => {
    addReply('t2', { author: 'dave', body: 'Hello' });
    const t = getThreads().find((t) => t.id === 't2')!;
    expect(t.replies.length).toBe(1);
    expect(t.replies[0].body).toBe('Hello');
  });

  it('addReply on unknown thread returns null', () => {
    expect(addReply('unknown', { author: 'x', body: 'y' })).toBeNull();
  });
});
