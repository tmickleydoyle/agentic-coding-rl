# TagInput

A tag input component that allows users to add and remove string tags.

## Behavior
- Renders a text input and a list of current tags
- User types in the input and presses Enter to add a tag
- Empty strings are not added as tags
- Duplicate tags are not added (case-sensitive comparison)
- Each tag has a remove button (×) that deletes it from the list
- After adding a tag, the input is cleared
- Tags are displayed in insertion order

## Props
None — component manages its own state.

## Data-testids
- `tag-input` — the text input element
- `tag-list` — the container wrapping all tags
- `tag-{value}` — each individual tag chip (e.g. `tag-react`)
- `remove-{value}` — the remove button inside each tag chip

## Types
```ts
// Internal state only
tags: string[]
inputValue: string
```
