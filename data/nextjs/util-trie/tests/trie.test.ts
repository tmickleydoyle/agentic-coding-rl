import { describe, it, expect } from 'vitest';
import { Trie } from '../lib/trie';

describe('Trie', () => {
  it('inserts and finds exact words', () => {
    const t = new Trie();
    t.insert('cat');
    expect(t.has('cat')).toBe(true);
    expect(t.has('ca')).toBe(false);
    expect(t.has('cats')).toBe(false);
  });

  it('startsWith matches prefixes but not absent ones', () => {
    const t = new Trie();
    t.insert('apple');
    expect(t.startsWith('app')).toBe(true);
    expect(t.startsWith('apple')).toBe(true);
    expect(t.startsWith('apx')).toBe(false);
  });

  it('a prefix is not a word unless inserted', () => {
    const t = new Trie();
    t.insert('apple');
    expect(t.has('app')).toBe(false);
    t.insert('app');
    expect(t.has('app')).toBe(true);
  });

  it('insert is idempotent', () => {
    const t = new Trie();
    t.insert('dog');
    t.insert('dog');
    expect(t.has('dog')).toBe(true);
    expect(t.wordsWithPrefix('dog')).toEqual(['dog']);
  });

  it('handles the empty string as a word', () => {
    const t = new Trie();
    t.insert('');
    expect(t.has('')).toBe(true);
    expect(t.startsWith('')).toBe(true);
  });

  it('startsWith("") is false on an empty trie', () => {
    const t = new Trie();
    expect(t.startsWith('')).toBe(false);
  });

  it('delete returns false for an absent word', () => {
    const t = new Trie();
    t.insert('cat');
    expect(t.delete('dog')).toBe(false);
    expect(t.has('cat')).toBe(true);
  });

  it('delete removes a word and returns true', () => {
    const t = new Trie();
    t.insert('cat');
    expect(t.delete('cat')).toBe(true);
    expect(t.has('cat')).toBe(false);
    expect(t.startsWith('ca')).toBe(false);
  });

  it('deleting a shorter word keeps a longer word that shares the prefix', () => {
    const t = new Trie();
    t.insert('app');
    t.insert('apple');
    expect(t.delete('app')).toBe(true);
    expect(t.has('app')).toBe(false);
    expect(t.has('apple')).toBe(true);
    expect(t.startsWith('app')).toBe(true);
  });

  it('wordsWithPrefix returns sorted matches including the prefix word', () => {
    const t = new Trie();
    ['app', 'apple', 'apply', 'ape', 'banana'].forEach((w) => t.insert(w));
    expect(t.wordsWithPrefix('app')).toEqual(['app', 'apple', 'apply']);
    expect(t.wordsWithPrefix('ap')).toEqual(['ape', 'app', 'apple', 'apply']);
    expect(t.wordsWithPrefix('z')).toEqual([]);
  });

  it('wordsWithPrefix("") returns all words sorted', () => {
    const t = new Trie();
    ['cherry', 'apple', 'banana'].forEach((w) => t.insert(w));
    expect(t.wordsWithPrefix('')).toEqual(['apple', 'banana', 'cherry']);
  });
});
