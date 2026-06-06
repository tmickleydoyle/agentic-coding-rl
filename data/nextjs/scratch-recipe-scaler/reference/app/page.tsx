'use client'
import { useState } from 'react'

interface Ingredient {
  name: string
  amount: number
  unit: string
}

interface Recipe {
  id: number
  name: string
  baseServings: number
  ingredients: Ingredient[]
}

const RECIPES: Recipe[] = [
  {
    id: 1,
    name: 'Chocolate Chip Cookies',
    baseServings: 24,
    ingredients: [
      { name: 'all-purpose flour', amount: 2.25, unit: 'cups' },
      { name: 'baking soda', amount: 1, unit: 'tsp' },
      { name: 'salt', amount: 1, unit: 'tsp' },
      { name: 'butter', amount: 1, unit: 'cup' },
      { name: 'granulated sugar', amount: 0.75, unit: 'cup' },
      { name: 'brown sugar', amount: 0.75, unit: 'cup' },
      { name: 'eggs', amount: 2, unit: '' },
      { name: 'vanilla extract', amount: 2, unit: 'tsp' },
      { name: 'chocolate chips', amount: 2, unit: 'cups' },
    ],
  },
  {
    id: 2,
    name: 'Banana Bread',
    baseServings: 8,
    ingredients: [
      { name: 'bananas', amount: 3, unit: '' },
      { name: 'butter', amount: 0.33, unit: 'cup' },
      { name: 'sugar', amount: 0.75, unit: 'cup' },
      { name: 'egg', amount: 1, unit: '' },
      { name: 'vanilla', amount: 1, unit: 'tsp' },
      { name: 'flour', amount: 1.5, unit: 'cups' },
      { name: 'baking soda', amount: 1, unit: 'tsp' },
      { name: 'salt', amount: 0.25, unit: 'tsp' },
    ],
  },
  {
    id: 3,
    name: 'Pancakes',
    baseServings: 4,
    ingredients: [
      { name: 'flour', amount: 1, unit: 'cup' },
      { name: 'baking powder', amount: 2, unit: 'tsp' },
      { name: 'salt', amount: 0.5, unit: 'tsp' },
      { name: 'sugar', amount: 1, unit: 'tbsp' },
      { name: 'milk', amount: 1, unit: 'cup' },
      { name: 'egg', amount: 1, unit: '' },
      { name: 'butter', amount: 2, unit: 'tbsp' },
    ],
  },
]

export default function App() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(RECIPES[0])
  const [servings, setServings] = useState(RECIPES[0].baseServings)

  function selectRecipe(recipe: Recipe) {
    setSelectedRecipe(recipe)
    setServings(recipe.baseServings)
  }

  function handleServings(val: number) {
    setServings(val < 1 ? 1 : val)
  }

  const scale = servings / selectedRecipe.baseServings

  return (
    <div>
      <h1>Recipe Scaler</h1>

      <div data-testid="recipe-selector">
        {RECIPES.map(r => (
          <button
            key={r.id}
            onClick={() => selectRecipe(r)}
            aria-pressed={selectedRecipe.id === r.id}
          >
            {r.name}
          </button>
        ))}
      </div>

      <p data-testid="base-servings">Base: {selectedRecipe.baseServings} servings</p>

      <label htmlFor="servings-input">Servings</label>
      <input
        id="servings-input"
        type="number"
        min={1}
        value={servings}
        onChange={e => handleServings(parseInt(e.target.value, 10) || 1)}
      />

      <p data-testid="scale-factor">Scale: {scale.toFixed(2)}×</p>

      <ul>
        {selectedRecipe.ingredients.map((ing, idx) => {
          const scaled = (ing.amount * scale).toFixed(2)
          return (
            <li key={idx} data-testid="ingredient">
              <span data-testid="ingredient-amount">{scaled}</span>
              <span data-testid="ingredient-unit">{ing.unit}</span>
              <span data-testid="ingredient-name">{ing.name}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
