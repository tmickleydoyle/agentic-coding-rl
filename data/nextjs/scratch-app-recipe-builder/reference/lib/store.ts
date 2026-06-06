import { Recipe, Ingredient } from './types'

const SEED_RECIPES: Recipe[] = [
  { id: 'r1', name: 'Pasta Carbonara', description: 'Classic Italian pasta', ingredients: ['pasta', 'eggs', 'bacon'], favorite: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'r2', name: 'Caesar Salad', description: 'Crispy romaine salad', ingredients: ['romaine', 'croutons', 'dressing'], favorite: false, createdAt: '2026-01-02T00:00:00Z' },
  { id: 'r3', name: 'Avocado Toast', description: 'Simple breakfast', ingredients: ['bread', 'avocado'], favorite: true, createdAt: '2026-01-03T00:00:00Z' },
]

const SEED_INGREDIENTS: Ingredient[] = [
  { id: 'i1', name: 'pasta', quantity: '500g' },
  { id: 'i2', name: 'eggs', quantity: '6' },
]

let recipes: Recipe[] = SEED_RECIPES.map(r => ({ ...r, ingredients: [...r.ingredients] }))
let ingredients: Ingredient[] = SEED_INGREDIENTS.map(i => ({ ...i }))

export function getRecipes(): Recipe[] {
  return [...recipes]
}

export function addRecipe(data: { name: string; description: string; ingredients: string[] }): Recipe {
  const r: Recipe = { id: `r${Date.now()}`, ...data, favorite: false, createdAt: new Date().toISOString() }
  recipes.push(r)
  return r
}

export function toggleFavorite(id: string): Recipe | null {
  const r = recipes.find(r => r.id === id)
  if (!r) return null
  r.favorite = !r.favorite
  return r
}

export function getIngredients(): Ingredient[] {
  return [...ingredients]
}

export function addIngredient(data: { name: string; quantity: string }): Ingredient {
  const i: Ingredient = { id: `i${Date.now()}`, ...data }
  ingredients.push(i)
  return i
}

export function __reset(): void {
  recipes = SEED_RECIPES.map(r => ({ ...r, ingredients: [...r.ingredients] }))
  ingredients = SEED_INGREDIENTS.map(i => ({ ...i }))
}
