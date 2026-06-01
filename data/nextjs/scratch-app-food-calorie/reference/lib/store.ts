import type { Meal } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state — the API has its own seed data + lifecycle. Tests call __reset() in beforeEach.

let meals: Meal[] = []
let nextId = 1

function seed(): void {
  meals = [
    { id: 'm1', name: 'Oatmeal', date: '2026-05-29', calories: 320, protein: 12, carbs: 54, fat: 6 },
    { id: 'm2', name: 'Chicken salad', date: '2026-05-29', calories: 450, protein: 38, carbs: 20, fat: 22 },
    { id: 'm3', name: 'Apple', date: '2026-05-28', calories: 95, protein: 0, carbs: 25, fat: 0 },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listMeals(filter?: { date?: string | null }): Meal[] {
  let out = meals.slice()
  const date = filter?.date
  if (date) out = out.filter((m) => m.date === date)
  return out
}

export function createMeal(input: {
  name: string
  date: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
}): Meal {
  const meal: Meal = {
    id: `m${nextId++}`,
    name: input.name,
    date: input.date,
    calories: input.calories,
    protein: input.protein ?? 0,
    carbs: input.carbs ?? 0,
    fat: input.fat ?? 0,
  }
  meals.push(meal)
  return meal
}

export function findMeal(id: string): Meal | undefined {
  return meals.find((m) => m.id === id)
}

export function deleteMeal(id: string): boolean {
  const idx = meals.findIndex((m) => m.id === id)
  if (idx === -1) return false
  meals.splice(idx, 1)
  return true
}
