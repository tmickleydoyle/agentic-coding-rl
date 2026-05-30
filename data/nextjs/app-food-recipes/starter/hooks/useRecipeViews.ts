'use client'
import { useRecipes } from '../components/AppStateProvider'
import type { Recipe } from '../lib/types'

export function uniqueCuisines(_recipes: Recipe[]): string[] {
  // TODO: return the sorted unique cuisine list
  return []
}

export function filterRecipes(
  _recipes: Recipe[],
  _cuisineFilter: string,
  _query: string,
): Recipe[] {
  // TODO: filter by cuisine AND case-insensitive title query
  return []
}

export function useRecipeViews() {
  useRecipes()
  // TODO: derive cuisines, filtered, favorites from shared state
  return { cuisines: [] as string[], filtered: [] as Recipe[], favorites: [] as Recipe[] }
}
