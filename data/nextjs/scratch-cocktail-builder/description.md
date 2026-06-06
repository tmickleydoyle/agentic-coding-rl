# Cocktail Recipe Builder

A single-page React app for creating and browsing cocktail recipes.

## Seed Data

The app starts with the following cocktails pre-loaded:

**Margarita**
- Ingredients: Tequila (2 oz), Triple Sec (1 oz), Lime juice (1 oz), Salt (pinch)
- Instructions: Rim glass with salt. Combine tequila, triple sec, and lime juice with ice. Shake well. Strain into glass.
- Category: Classic

**Old Fashioned**
- Ingredients: Bourbon (2 oz), Sugar (1 tsp), Angostura bitters (2 dashes), Orange peel (1)
- Instructions: Muddle sugar with bitters. Add bourbon and ice. Stir gently. Garnish with orange peel.
- Category: Classic

**Aperol Spritz**
- Ingredients: Aperol (3 oz), Prosecco (2 oz), Soda water (splash), Orange slice (1)
- Instructions: Fill glass with ice. Add Aperol and Prosecco. Top with soda water. Garnish with orange.
- Category: Modern

## Fields

Each cocktail has:
- **name** (string): cocktail name
- **category** (string): "Classic" or "Modern"
- **ingredients** (array of strings): each ingredient with amount
- **instructions** (string): preparation steps

## UI Layout

- Page heading: "Cocktail Builder"
- Category filter buttons: "All", "Classic", "Modern"
- Cocktail list: cards showing name, category, ingredients list, instructions
- Add cocktail form:
  - Name input
  - Category select (Classic / Modern)
  - Ingredients: a text input with "Add Ingredient" button; added ingredients appear as a list with a remove (×) button each
  - Instructions textarea
  - Submit button "Save Cocktail"

## Behaviors

1. **Filter**: Clicking "Classic" or "Modern" filters the list. "All" shows all.
2. **Ingredient management**: User types an ingredient and clicks "Add Ingredient" — it appears in a pending list. Each pending ingredient has a remove button. These pending ingredients become the cocktail's ingredients on save.
3. **Save Cocktail**: Clicking "Save Cocktail" with a non-empty Name and at least one ingredient appends the cocktail. Form resets (name, category, instructions cleared; ingredient list cleared).
4. **Empty guard**: If Name is empty or ingredient list is empty, clicking "Save Cocktail" does nothing.
5. **Ingredient display**: In cards, ingredients are shown as a bulleted list.

## Data-testids

- `cocktail-list` — container for cocktail cards
- `cocktail-card` — each cocktail card
- `cocktail-name` — name in card
- `cocktail-category` — category in card
- `cocktail-ingredients` — ingredients list in card
- `cocktail-instructions` — instructions in card
- `filter-all` — All filter button
- `filter-classic` — Classic filter button
- `filter-modern` — Modern filter button
- `input-name` — Name input
- `input-category` — Category select
- `input-ingredient` — ingredient text input
- `add-ingredient` — Add Ingredient button
- `ingredient-list` — pending ingredients container
- `ingredient-item` — each pending ingredient (multiple)
- `remove-ingredient` — remove button on each pending ingredient
- `input-instructions` — Instructions textarea
- `submit-cocktail` — Save Cocktail button

## Edge Cases

- Clicking "Add Ingredient" with empty input does nothing.
- Removing all pending ingredients and then saving does nothing.
- After saving, the pending ingredient list is empty and ingredient input is cleared.
