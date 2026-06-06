# Word Counter

A React component with a textarea that counts and displays the number of words as the user types.

## Behavior

- Renders a textarea for user input
- Displays the current word count below the textarea
- Word count updates on every keystroke (controlled input)
- Words are defined as sequences of non-whitespace characters separated by whitespace
- Empty string or whitespace-only input has a word count of 0
- A "Clear" button resets both the textarea and word count to empty/0

## Component

`components/WordCounter.tsx`

```tsx
export default function WordCounter(): JSX.Element
```

## Word Count Logic

```
text.trim() === '' ? 0 : text.trim().split(/\s+/).length
```

## Data TestIDs

- `textarea` — the text input area
- `word-count` — element displaying the numeric word count
- `clear-btn` — button that clears the textarea

## Edge Cases

- Empty input: count is 0
- Whitespace-only: count is 0
- Multiple spaces between words count as one separator
- Newlines count as whitespace separators
