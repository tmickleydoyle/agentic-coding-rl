import type { Dish } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `dishes` + id counter; seed them; provide __reset() to re-seed.
// Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listDishes(_filter?: {
  category?: string | null
  vegetarian?: string | null
}): Dish[] {
  // TODO: return dishes, applying optional category + vegetarian filters
  return []
}

export function createDish(_input: {
  name: string
  category?: string
  price?: number
  vegetarian?: boolean
}): Dish {
  // TODO: append a new dish with a fresh id and return it
  return { id: '', name: '', category: '', price: 0, vegetarian: false }
}

export function findDish(_id: string): Dish | undefined {
  // TODO: look up a dish by id
  return undefined
}

export function deleteDish(_id: string): boolean {
  // TODO: remove the dish; return whether it existed
  return false
}
