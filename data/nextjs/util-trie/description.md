# Trie (prefix tree)

Implement a `Trie` class in `lib/trie.ts`.

```ts
export class Trie {
  insert(word: string): void;
  has(word: string): boolean;
  startsWith(prefix: string): boolean;
  delete(word: string): boolean;
  wordsWithPrefix(prefix: string): string[];
}
```

Behavior:

- `insert(word)` adds `word` to the trie. Inserting the same word twice is idempotent.
  The empty string `''` is a valid word.
- `has(word)` returns `true` iff `word` was inserted and not deleted (exact match, not
  just a prefix).
- `startsWith(prefix)` returns `true` iff some stored word equals `prefix` or has
  `prefix` as a proper prefix. `startsWith('')` is `true` iff the trie holds any word.
- `delete(word)` removes `word`. Returns `true` if the word was present (and removed),
  `false` otherwise. After deleting, nodes that are no longer part of any word must be
  pruned, but nodes shared with a still-present longer word must remain (e.g. deleting
  `'app'` must not remove `'apple'`).
- `wordsWithPrefix(prefix)` returns all stored words that start with `prefix` (including
  `prefix` itself if it is a word), sorted in ascending lexicographic order. Returns
  `[]` when none match.

Export `Trie` as a named export.
