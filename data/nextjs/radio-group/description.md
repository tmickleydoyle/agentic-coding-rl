# Radio group

Implement a client component `RadioGroup` in `components/RadioGroup.tsx`:

- Accepts a prop `options: string[]`.
- Renders one `<input type="radio" data-testid="r-<opt>" name="group">` per option.
- Renders `<span data-testid="selected">` showing the currently selected option, or `"none"` when nothing is selected.
- Starts with **nothing selected**.

Default export.
