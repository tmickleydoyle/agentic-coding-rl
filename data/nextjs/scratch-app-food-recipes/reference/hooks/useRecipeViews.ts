'use client'
import { useRecipes } from '../components/AppStateProvider'
import type { Recipe } from '../lib/types'

export function uniqueCuisines(recipes: Recipe[]): string[] {
  const set = new Set<string>()
  recipes.forEach((r) => set.add(r.cuisine))
  return Array.from(set).sort()
}

export function filterRecipes(
  recipes: Recipe[],
  cuisineFilter: string,
  query: string,
): Recipe[] {
  const q = query.trim().toLowerCase()
  return recipes.filter((r) => {
    if (cuisineFilter !== 'all' && r.cuisine !== cuisineFilter) return false
    if (q.length > 0 && !r.title.toLowerCase().includes(q)) return false
    return true
  })
}

export function useRecipeViews() {
  const { recipes, cuisineFilter, query } = useRecipes()
  const cuisines = uniqueCuisines(recipes)
  const filtered = filterRecipes(recipes, cuisineFilter, query)
  const favorites = recipes.filter((r) => r.favorite)
  return { cuisines, filtered, favorites }
}
