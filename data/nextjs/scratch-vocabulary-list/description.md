# Vocabulary List App

A single-page React app for building a personal vocabulary list with definitions and mastery tracking.

## Seed Data

Four words pre-loaded:
```
{ id: 1, word: "Ephemeral", definition: "Lasting for a very short time.", mastered: false }
{ id: 2, word: "Luminous", definition: "Full of or shedding light; bright.", mastered: true }
{ id: 3, word: "Tenacious", definition: "Holding firm to a purpose; persistent.", mastered: false }
{ id: 4, word: "Quixotic", definition: "Exceedingly idealistic; unrealistic.", mastered: false }
```

## UI Layout

- `<h1>` with text "Vocabulary List"
- Add-word form with:
  - Text input labeled "Word"
  - Textarea labeled "Definition"
  - Button "Add Word"
- Filter controls:
  - Button "Show All" — shows all words
  - Button "Show Mastered" — shows only mastered words
  - Button "Show Unmastered" — shows only unmastered words
- Word list showing filtered words
- Summary stats

## Word List

Each word renders as `<li>` with `data-testid="word-item"` containing:
- `data-testid="word-term"` — the word
- `data-testid="word-definition"` — the definition
- `data-testid="word-status"` — "Mastered" if mastered, "Learning" if not
- A toggle button: "Mark Mastered" if not yet mastered, "Mark Learning" if already mastered
- A "Remove" button to delete the entry

## Summary

- `data-testid="word-count"` — "Words: N" (total words, not filtered count)
- `data-testid="mastered-count"` — "Mastered: N"

## Interactions

1. Fill Word and Definition and click "Add Word" — new word appended, mastered defaults to false.
2. Adding clears both fields.
3. If Word or Definition is empty (after trim), "Add Word" does nothing.
4. Clicking "Mark Mastered" on a word sets mastered=true; button changes to "Mark Learning".
5. Clicking "Mark Learning" sets mastered=false; button changes to "Mark Mastered".
6. word-status updates immediately when mastery toggled.
7. Filter buttons change which words are displayed; summary counts always reflect full list.
8. Clicking "Remove" deletes the word from the list regardless of current filter.

## Edge Cases

- Whitespace-only Word or Definition is treated as empty.
- After toggling mastery, the filter view updates (a newly mastered word disappears from "Show Unmastered" view).
- word-count and mastered-count always reflect totals, not filtered subset.
