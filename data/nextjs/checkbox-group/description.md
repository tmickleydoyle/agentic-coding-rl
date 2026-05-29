# Checkbox group

Implement a client component `CheckboxGroup` in `components/CheckboxGroup.tsx`:

- Accepts a prop `options: string[]`.
- Renders one `<input type="checkbox" data-testid="cb-<opt>">` per option (e.g., `data-testid="cb-red"`), each unchecked initially.
- Renders `<span data-testid="count">` with the number of currently-checked boxes as a string (`"0"`, `"1"`, …).

Default export.
