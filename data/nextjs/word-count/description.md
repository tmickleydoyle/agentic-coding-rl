# Word count

Implement a client component `WordCount` in `components/WordCount.tsx`:

- A controlled `<textarea data-testid="text">`.
- An element `data-testid="count"` showing the number of **whitespace-separated** words as a string.
  - Empty / whitespace-only input → `"0"`.
  - Words are split on any whitespace; multiple spaces don't count as multiple words.

Default export.
