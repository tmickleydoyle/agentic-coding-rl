# Recipe Scaler App

Build a single-page recipe scaling app that lets users pick a recipe, adjust the serving count, and see ingredient amounts scaled proportionally.

## Seed Recipes

**Chocolate Chip Cookies** (base: 24 servings)
- 2.25 cups all-purpose flour
- 1 tsp baking soda
- 1 tsp salt
- 1 cup butter
- 0.75 cup granulated sugar
- 0.75 cup brown sugar
- 2 eggs
- 2 tsp vanilla extract
- 2 cups chocolate chips

**Banana Bread** (base: 8 servings)
- 3 bananas
- 0.33 cup butter
- 0.75 cup sugar
- 1 egg
- 1 tsp vanilla
- 1.5 cups flour
- 1 tsp baking soda
- 0.25 tsp salt

**Pancakes** (base: 4 servings)
- 1 cup flour
- 2 tsp baking powder
- 0.5 tsp salt
- 1 tbsp sugar
- 1 cup milk
- 1 egg
- 2 tbsp butter

## UI Layout

- Page heading: "Recipe Scaler"
- A recipe selector: a set of buttons or a select listing recipe names. Selected recipe is highlighted (aria-pressed on buttons or reflected by select value).
- A servings input labeled "Servings" (number, min 1) showing the current desired servings
- A displayed base serving note: "Base: X servings" (data-testid="base-servings")
- A list of scaled ingredients (data-testid="ingredient" per row) showing:
  - Ingredient name
  - Scaled amount rounded to 2 decimal places
  - Unit
- A scale factor indicator (data-testid="scale-factor") showing "Scale: X.XX×" where X = desired/base

## Interactions

1. **Select recipe**: Clicking a recipe button/option loads that recipe's ingredients at its base serving count.
2. **Change servings**: Typing a new number in the Servings input scales all ingredient amounts = (ingredient_base_amount * desired_servings / base_servings), rounded to 2 decimal places.
3. **Switch recipe**: Switching recipe resets servings to the new recipe's base.
4. **Scale factor**: Updates live as servings change.

## Edge Cases

- Minimum servings is 1; values less than 1 are treated as 1.
- When servings equals base, scale factor is "Scale: 1.00×".
- All amounts display with exactly 2 decimal places.
