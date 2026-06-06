# Quote Collector App

A single-page React app for saving and browsing inspirational quotes by category.

## Seed Data

Four quotes pre-loaded:
```
{ id: 1, text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivation" }
{ id: 2, text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", category: "Wisdom" }
{ id: 3, text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "Motivation" }
{ id: 4, text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" }
```

## UI Layout

- `<h1>` with text "Quote Collector"
- Add-quote form with:
  - Textarea labeled "Quote Text"
  - Text input labeled "Author"
  - Text input labeled "Category"
  - Button "Add Quote"
- Category filter: a `<select>` labeled "Filter by Category" with options "All" plus each unique category in the current list (sorted alphabetically). When a category is selected, only quotes in that category are shown.
- Quote list showing filtered quotes
- Summary showing total number of displayed quotes

## Quote List

Each quote renders as `<li>` with `data-testid="quote-item"` containing:
- `data-testid="quote-text"` — the quote text
- `data-testid="quote-author"` — displayed as "— AuthorName"
- `data-testid="quote-category"` — the category name
- A "Remove" button that deletes the quote

## Summary

- `data-testid="quote-count"` — "Showing N quote(s)"

## Interactions

1. Fill Quote Text, Author, Category and click "Add Quote" — new quote appended to list.
2. Adding a quote clears all three fields.
3. If Quote Text or Author is empty (after trim), clicking "Add Quote" does nothing.
4. The category filter select shows "All" + sorted unique categories from the current full list.
5. Selecting a category from the filter shows only quotes matching that category; count updates.
6. Selecting "All" shows all quotes.
7. Clicking "Remove" deletes the quote from the list (even if it is currently hidden by filter).
8. After deleting the last quote in a category, that category no longer appears in the filter.

## Edge Cases

- Whitespace-only Quote Text or Author is treated as empty.
- Category field defaults to "General" if left blank when adding.
- Quote count reflects currently displayed (filtered) quotes, not total.
