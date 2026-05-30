import type { Assignment, Recipe } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `assignments` + id counter; seed recipes/assignments; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listRecipes(): Recipe[] {
  // TODO: return the seed recipes
  return []
}

export function listAssignments(_filter?: { day?: string | null }): Assignment[] {
  // TODO: return assignments, applying an optional day filter
  return []
}

export function createAssignment(_input: { day: string; recipeId: string }): Assignment {
  // TODO: append a new assignment with a fresh id and return it
  return { id: '', day: 'Mon', recipeId: '' }
}

export function deleteAssignment(_id: string): boolean {
  // TODO: remove the assignment; return whether it existed
  return false
}
