import { describe, it, expect, vi } from 'vitest';
import { retry } from '../lib/retry';

describe('retry', () => {
  it('resolves immediately when the first attempt succeeds', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    await expect(retry(fn, 3)).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries after rejections and resolves on a later success', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('e1'))
      .mockRejectedValueOnce(new Error('e2'))
      .mockResolvedValue('done');
    await expect(retry(fn, 5)).resolves.toBe('done');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('rejects with the last error if all attempts fail', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('first'))
      .mockRejectedValue(new Error('last'));
    await expect(retry(fn, 3)).rejects.toThrow('last');
  });

  it('invokes fn exactly `attempts` times when all fail', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('nope'));
    await expect(retry(fn, 4)).rejects.toThrow('nope');
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it('does not retry once it has succeeded', async () => {
    const fn = vi.fn().mockResolvedValueOnce('a').mockResolvedValue('b');
    await expect(retry(fn, 3)).resolves.toBe('a');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('attempts === 1 means a single try with no retry', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('once'));
    await expect(retry(fn, 1)).rejects.toThrow('once');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
