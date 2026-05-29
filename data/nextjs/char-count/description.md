# Character counter

Implement a client component `CharCount` in `components/CharCount.tsx`:

- A controlled `<input data-testid="input">`.
- An element `data-testid="count"` showing the current character count as a string (e.g., `"0"`, `"7"`).
- When the input length is **> 100 characters**, additionally render an element
  `data-testid="warning"` with the text `"Too long"`. This element must be **absent** from the DOM when length ≤ 100.

Default export.
