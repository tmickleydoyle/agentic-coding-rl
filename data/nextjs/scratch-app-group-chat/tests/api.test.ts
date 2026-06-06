import { describe, it, expect, beforeEach } from 'vitest';
import { __reset, getRooms, getRoom, sendMessage, joinRoom } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Group Chat API (store layer)', () => {
  it('getRooms returns 3 rooms', () => {
    expect(getRooms().length).toBe(3);
  });

  it('getRoom returns the correct room', () => {
    const r = getRoom('room1');
    expect(r?.name).toBe('General');
  });

  it('getRoom returns undefined for unknown id', () => {
    expect(getRoom('unknown')).toBeUndefined();
  });

  it('sendMessage appends a message', () => {
    sendMessage('room1', { author: 'dave', body: 'Hey' });
    expect(getRoom('room1')!.messages.length).toBe(3);
  });

  it('sendMessage returns null for unknown room', () => {
    expect(sendMessage('unknown', { author: 'x', body: 'y' })).toBeNull();
  });

  it('joinRoom adds a new member', () => {
    joinRoom('room3', 'alice');
    expect(getRoom('room3')!.members).toContain('alice');
  });

  it('joinRoom is idempotent', () => {
    joinRoom('room1', 'alice');
    joinRoom('room1', 'alice');
    expect(getRoom('room1')!.members.filter((m) => m === 'alice').length).toBe(1);
  });

  it('joinRoom returns null for unknown room', () => {
    expect(joinRoom('unknown', 'alice')).toBeNull();
  });
});
