# SearchFilterList

A search input that filters a static list of items in real time.

## Behavior
- Renders a text input and a list of items
- Items are filtered as the user types — case-insensitive substring match against item label
- Displays only matching items; shows all items when input is empty
- Shows a "No results" message when no items match
- Each list item displays its label

## Props
```ts
interface Item {
  id: string
  label: string
}

interface SearchFilterListProps {
  items: Item[]
}
```

## Data-testids
- `search-input` — the text input
- `item-{id}` — each visible list item (e.g. `item-apple`)
- `no-results` — the "No results" message shown when list is empty
