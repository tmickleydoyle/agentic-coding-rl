# Scratch Recipe Cost — Recipe Cost Calculator

Build a single-page React app for calculating ingredient costs for a recipe with a per-serving breakdown.

## Seed Data

Pre-loaded recipe: name "Spaghetti Carbonara", servings: 4

Pre-loaded ingredients:
- id:1, name:"Spaghetti", amount:400, unit:"g", pricePerUnit:0.005 (price per gram)
- id:2, name:"Eggs", amount:4, unit:"pcs", pricePerUnit:0.30 (price per egg)
- id:3, name:"Pancetta", amount:150, unit:"g", pricePerUnit:0.04 (price per gram)
- id:4, name:"Parmesan", amount:100, unit:"g", pricePerUnit:0.06 (price per gram)
- id:5, name:"Black Pepper", amount:5, unit:"g", pricePerUnit:0.02 (price per gram)

## Fields

Recipe state:
- name (string)
- servings (number)

Each ingredient:
- id (number)
- name (string)
- amount (number)
- unit (string)
- pricePerUnit (number — cost per one unit)

Derived:
- cost = amount * pricePerUnit
- totalCost = sum of all ingredient costs
- costPerServing = totalCost / servings

## Layout

- Page heading: "Recipe Cost Calculator"
- Recipe info section:
  - Text input labeled "Recipe Name" (data-testid="recipe-name-input"), pre-filled with seed name
  - Number input labeled "Servings" (data-testid="servings-input"), pre-filled with 4
- Cost summary:
  - data-testid="total-cost" — total cost formatted to 2 decimal places, e.g. "4.50"
  - data-testid="cost-per-serving" — per-serving cost to 2 decimal places
  - data-testid="ingredient-count" — number of ingredients
- Add ingredient form:
  - Text input "Ingredient Name" (data-testid="ingredient-name-input")
  - Number input "Amount" (data-testid="amount-input")
  - Text input "Unit" (data-testid="unit-input")
  - Number input "Price per Unit" (data-testid="price-per-unit-input")
  - Button "Add Ingredient" (data-testid="add-ingredient-btn")
- Ingredient list. Each row:
  - data-testid="ingredient-row-{id}"
  - data-testid="ingredient-name-{id}" — ingredient name
  - data-testid="ingredient-amount-{id}" — "{amount} {unit}"
  - data-testid="ingredient-cost-{id}" — line cost formatted to 2 decimal places
  - Delete button (data-testid="delete-ingredient-{id}") labeled "Delete"

## Behaviors

1. Recipe name and servings are editable inline. Changing servings immediately updates cost-per-serving (servings must be >= 1; if set to 0 or invalid, treat as 1).
2. Add Ingredient: name non-empty, amount > 0, pricePerUnit >= 0. Unit defaults to "g" if empty. After adding, reset ingredient form inputs.
3. Delete ingredient: removes it; total cost and per-serving cost update immediately.
4. All cost calculations are live (re-computed on every state change).
5. Ingredient line cost = amount * pricePerUnit.
6. totalCost = sum of all line costs.
7. costPerServing = totalCost / max(servings, 1).

## Edge Cases

- Deleting all ingredients shows totalCost "0.00" and costPerServing "0.00".
- Adding an ingredient with pricePerUnit 0 is allowed (free ingredient).
- Setting servings to 0 defaults to 1 for division to avoid NaN/Infinity.
- Adding with empty name does nothing.
