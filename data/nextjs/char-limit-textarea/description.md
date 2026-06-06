# Character Limit Textarea

A textarea component with a visible character count and a maximum character limit of 140.

## Component: `CharLimitTextarea`

### Behavior
- Renders a `<textarea>` with a maximum of **140 characters**.
- Displays a live character count showing `"X / 140"` where X is the current character count.
- The textarea enforces the limit: it will not accept characters beyond 140 (use `maxLength={140}` on the element).
- When the user is at or above **120 characters**, the counter text turns red (apply a style or class indicating warning).
- When below 120 characters, the counter is displayed normally.

### Data Test IDs
- `data-testid="char-textarea"` — the textarea element
- `data-testid="char-count"` — the element showing `"X / 140"`
- `data-testid="char-warning"` — an element that is rendered (visible) only when count >= 120, hidden otherwise

### Types & Signatures
```tsx
export default function CharLimitTextarea(): JSX.Element
```

### Edge Cases
- Initial count shows `"0 / 140"`.
- Warning element is not visible (display: none or not rendered) when count < 120.
- Warning element is visible when count >= 120.
