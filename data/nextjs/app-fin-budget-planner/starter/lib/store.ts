import type { Category, Expense } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `categories`, `expenses`, and id counters; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listCategories(): Category[] {
  // TODO: return all categories
  return []
}

export function createCategory(_input: { name: string; planned?: number }): Category {
  // TODO: append a new category with a fresh id and return it
  return { id: '', name: '', planned: 0 }
}

export function findCategory(_id: string): Category | undefined {
  // TODO: look up a category by id
  return undefined
}

export function listExpenses(_filter?: { categoryId?: string | null }): Expense[] {
  // TODO: return expenses, applying optional categoryId filter
  return []
}

export function createExpense(_input: {
  categoryId: string
  amount: number
  note?: string
}): Expense {
  // TODO: append a new expense with a fresh id and return it
  return { id: '', categoryId: '', amount: 0, note: '' }
}

export function findExpense(_id: string): Expense | undefined {
  // TODO: look up an expense by id
  return undefined
}

export function deleteExpense(_id: string): boolean {
  // TODO: remove the expense; return whether it existed
  return false
}
