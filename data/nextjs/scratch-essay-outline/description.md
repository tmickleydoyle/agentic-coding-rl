# Essay Outline App

A single-page React app for building and organizing a hierarchical essay outline with sections and bullet points.

## Seed Data

Two sections pre-loaded, each with bullet points:
```
Section 1: { id: 1, title: "Introduction", bullets: ["Hook the reader", "State the thesis"] }
Section 2: { id: 2, title: "Body Paragraph 1", bullets: ["Topic sentence", "Supporting evidence", "Analysis"] }
```

## UI Layout

- `<h1>` with text "Essay Outline"
- Essay title field: text input labeled "Essay Title" with `data-testid="essay-title-input"`. Its value is displayed in `data-testid="essay-title-display"` (shows placeholder "Untitled Essay" when input is empty).
- Add-section form:
  - Text input labeled "Section Title"
  - Button "Add Section"
- Section list displaying all sections
- Summary

## Section List

Each section renders as `<div>` with `data-testid="section-item"` containing:
- `data-testid="section-title"` — the section title text
- A "Delete Section" button that removes the entire section
- An add-bullet sub-form:
  - Text input with aria-label `"Bullet for <section title>"` (exact section title used)
  - Button "Add Bullet"
- A `<ul>` of bullets where each `<li>` has `data-testid="bullet-item"` containing:
  - `data-testid="bullet-text"` — the bullet text
  - A "Remove" button to delete that bullet

## Summary

- `data-testid="section-count"` — "Sections: N"
- `data-testid="bullet-count"` — "Bullets: N" (total across all sections)

## Interactions

1. Typing in "Essay Title" input updates `essay-title-display` in real time.
2. Empty essay title shows "Untitled Essay" in display.
3. Fill "Section Title" and click "Add Section" — new section appended with empty bullet list.
4. Empty section title does nothing.
5. Fill bullet input for a section and click "Add Bullet" — bullet appended to that section only.
6. Empty bullet text does nothing.
7. Adding a bullet clears that section's bullet input.
8. "Delete Section" removes the section and all its bullets; counts update.
9. "Remove" on a bullet removes just that bullet; bullet count updates.
10. Section count and bullet count reflect totals across all sections.

## Edge Cases

- Whitespace-only Section Title or bullet text is treated as empty.
- Each section's bullet input is independent — typing in one does not affect others.
- Deleting all sections shows "Sections: 0" and "Bullets: 0".
