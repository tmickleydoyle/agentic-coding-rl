'use client'
import { usePlan } from '../components/AppStateProvider'
import type { Assignment, Day, GroceryItem, Recipe } from '../lib/types'

export function rollupGrocery(recipes: Recipe[], assignments: Assignment[]): GroceryItem[] {
  const counts: Record<string, number> = {}
  assignments.forEach((a) => {
    const recipe = recipes.find((r) => r.id === a.recipeId)
    if (!recipe) return
    recipe.ingredients.forEach((ing) => {
      counts[ing] = (counts[ing] ?? 0) + 1
    })
  })
  return Object.keys(counts)
    .sort()
    .map((name) => ({ name, count: counts[name] }))
}

export function usePlanViews() {
  const { recipes, assignments } = usePlan()

  const assignmentsFor = (day: Day): Assignment[] =>
    assignments.filter((a) => a.day === day)

  const mealCount = (day: Day): number => assignmentsFor(day).length

  const grocery = rollupGrocery(recipes, assignments)

  return { assignmentsFor, mealCount, grocery }
}
