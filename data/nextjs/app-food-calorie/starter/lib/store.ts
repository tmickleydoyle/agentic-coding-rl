import type { Meal } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `meals` + id counter; seed them; provide __reset() to re-seed.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listMeals(_filter?: { date?: string | null }): Meal[] {
  // TODO: return meals, applying optional date filter
  return []
}

export function createMeal(_input: {
  name: string
  date: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
}): Meal {
  // TODO: append a new meal with a fresh id and return it
  return { id: '', name: '', date: '', calories: 0, protein: 0, carbs: 0, fat: 0 }
}

export function findMeal(_id: string): Meal | undefined {
  // TODO: look up a meal by id
  return undefined
}

export function deleteMeal(_id: string): boolean {
  // TODO: remove the meal; return whether it existed
  return false
}
