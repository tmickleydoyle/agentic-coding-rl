# Language Cards

A flashcard application for learning foreign language vocabulary.

## Seed Data

```
const CARDS = [
  { id: 1, front: "Hola", back: "Hello", language: "Spanish", known: false },
  { id: 2, front: "Gracias", back: "Thank you", language: "Spanish", known: false },
  { id: 3, front: "Bonjour", back: "Hello", language: "French", known: false },
  { id: 4, front: "Merci", back: "Thank you", language: "French", known: false },
  { id: 5, front: "Ciao", back: "Hello/Goodbye", language: "Italian", known: false },
  { id: 6, front: "Grazie", back: "Thank you", language: "Italian", known: false },
]
```

## UI Structure

- `<h1>` with text "Language Cards"
- A filter `<select>` (`data-testid="language-filter"`) with options: "All", "Spanish", "French", "Italian"
- A counter `data-testid="card-count"` showing "X / Y cards" where X = known count, Y = total visible
- For each visible card:
  - A container `data-testid="card-{id}"`
  - A `data-testid="card-front-{id}"` showing the foreign word (always visible)
  - A `data-testid="card-back-{id}"` showing the translation (hidden until flipped)
  - A button `data-testid="flip-{id}"` with text "Show" (when hidden) or "Hide" (when shown)
  - A button `data-testid="known-{id}"` with text "Mark Known" or "Mark Unknown"
  - When `known=true`, the card container has class `known`

## Behaviors

1. **Filter**: Selecting a language from the dropdown shows only cards of that language. "All" shows all cards.
2. **Flip**: Clicking "Show" on a card reveals `card-back-{id}` and changes button text to "Hide". Clicking "Hide" hides the back again.
3. **Mark Known**: Clicking "Mark Known" sets `known=true` on that card, changes button text to "Mark Unknown", and adds class `known` to the container.
4. **Mark Unknown**: Clicking "Mark Unknown" sets `known=false`, reverts text and removes class.
5. **Counter**: `card-count` always reflects known/total for currently visible (filtered) cards.
6. **Filter resets nothing**: Switching filters preserves flip and known state of individual cards.

## Edge Cases

- The back of a card is hidden by default (not rendered or display:none style is fine, but `card-back-{id}` must not be visible until flipped).
- Counter updates immediately when known status changes.
- Filter changes counter to reflect only visible cards.
