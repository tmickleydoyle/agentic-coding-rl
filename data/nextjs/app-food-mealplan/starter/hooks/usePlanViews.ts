'use client'
import { usePlan } from '../components/AppStateProvider'
import type { Assignment, Day, GroceryItem, Recipe } from '../lib/types'

export function rollupGrocery(_recipes: Recipe[], _assignments: Assignment[]): GroceryItem[] {
  // TODO: roll up ingredients across all assignments, counting duplicates, sorted by name
  return []
}

export function usePlanViews() {
  usePlan()
  // TODO: derive assignmentsFor(day), mealCount(day), grocery from shared state
  return {
    assignmentsFor: (_day: Day): Assignment[] => [],
    mealCount: (_day: Day): number => 0,
    grocery: [] as GroceryItem[],
  }
}
