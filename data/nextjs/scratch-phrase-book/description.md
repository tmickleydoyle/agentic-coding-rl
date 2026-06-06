# Phrase Book

A travel phrase book app where users can browse phrases by category, mark favorites, and filter to show only favorites.

## Seed Data

```
const PHRASES = [
  { id: 1, english: "Where is the bathroom?", translation: "Où sont les toilettes?", category: "Essentials", favorite: false },
  { id: 2, english: "How much does it cost?", translation: "Combien ça coûte?", category: "Shopping", favorite: false },
  { id: 3, english: "I need a doctor.", translation: "J'ai besoin d'un médecin.", category: "Essentials", favorite: false },
  { id: 4, english: "A table for two, please.", translation: "Une table pour deux, s'il vous plaît.", category: "Restaurant", favorite: false },
  { id: 5, english: "Can I have the bill?", translation: "L'addition, s'il vous plaît.", category: "Restaurant", favorite: false },
  { id: 6, english: "Do you have this in another size?", translation: "Avez-vous ceci dans une autre taille?", category: "Shopping", favorite: false },
]
```

## UI Structure

- `<h1>` with text "Phrase Book"
- `data-testid="phrase-count"` showing "X phrases"
- **Filter controls**:
  - `<select>` with `data-testid="category-filter"` — options: "All", "Essentials", "Shopping", "Restaurant"
  - `<button>` with `data-testid="favorites-toggle"` — text "Show Favorites" when showing all, "Show All" when showing favorites only
- **Phrase list**: for each visible phrase:
  - `data-testid="phrase-{id}"` container
  - `data-testid="english-{id}"` showing english text
  - `data-testid="translation-{id}"` showing translation
  - `data-testid="category-{id}"` showing category name
  - `data-testid="favorite-btn-{id}"` button — text "Unfavorite" if favorite, "Favorite" if not

## Behaviors

1. **Initial**: All 6 phrases shown, count = "6 phrases", category = "All", not in favorites-only mode.
2. **Category filter**: Selecting a category shows only phrases in that category. "All" shows all.
3. **Favorite**: Clicking "Favorite" on a phrase sets favorite=true, button text becomes "Unfavorite".
4. **Unfavorite**: Clicking "Unfavorite" sets favorite=false, button text becomes "Favorite".
5. **Favorites toggle**: Clicking "Show Favorites" switches to favorites-only mode (shows only favorited phrases), button text changes to "Show All". Clicking "Show All" shows all again.
6. **Combined filter**: Category filter and favorites-only mode apply simultaneously (show only phrases matching both conditions).
7. **phrase-count**: Always reflects count of currently visible phrases.

## Edge Cases

- If favorites-only mode is on but no phrases are favorited, the list is empty and count = "0 phrases".
- Switching category while in favorites-only mode correctly intersects the two filters.
- Toggling favorite on a phrase does not change the category filter or favorites-only mode state.
