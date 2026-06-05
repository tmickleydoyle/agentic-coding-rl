import type { Assignment, Recipe } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state. Tests call __reset() in beforeEach for isolation.

const SEED_RECIPES: Recipe[] = [
  { id: 'r1', title: 'Oatmeal', ingredients: ['oats', 'milk', 'honey'] },
  { id: 'r2', title: 'Veggie Stir Fry', ingredients: ['rice', 'broccoli', 'soy sauce', 'garlic'] },
  { id: 'r3', title: 'Caesar Salad', ingredients: ['lettuce', 'croutons', 'parmesan', 'garlic'] },
]

let assignments: Assignment[] = []
let nextId = 1

function seed(): void {
  assignments = [
    { id: 'a1', day: 'Mon', recipeId: 'r1' },
    { id: 'a2', day: 'Mon', recipeId: 'r2' },
  ]
  nextId = 3
}

seed()

export function __reset(): void {
  seed()
}

export function listRecipes(): Recipe[] {
  return SEED_RECIPES.slice()
}

export function listAssignments(filter?: { day?: string | null }): Assignment[] {
  let out = assignments.slice()
  const day = filter?.day
  if (day) out = out.filter((a) => a.day === day)
  return out
}

export function createAssignment(input: { day: string; recipeId: string }): Assignment {
  const assignment: Assignment = {
    id: `a${nextId++}`,
    day: input.day as Assignment['day'],
    recipeId: input.recipeId,
  }
  assignments.push(assignment)
  return assignment
}

export function deleteAssignment(id: string): boolean {
  const idx = assignments.findIndex((a) => a.id === id)
  if (idx === -1) return false
  assignments.splice(idx, 1)
  return true
}
