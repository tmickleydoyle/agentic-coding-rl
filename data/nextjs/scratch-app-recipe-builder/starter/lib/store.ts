import { Recipe, Ingredient } from './types'

export function getRecipes(): Recipe[] { return [] }
export function addRecipe(_d: { name: string; description: string; ingredients: string[] }): Recipe {
  return { id: '', name: '', description: '', ingredients: [], favorite: false, createdAt: '' }
}
export function getIngredients(): Ingredient[] { return [] }
export function addIngredient(_d: { name: string; quantity: string }): Ingredient {
  return { id: '', name: '', quantity: '' }
}
export function __reset(): void {}
