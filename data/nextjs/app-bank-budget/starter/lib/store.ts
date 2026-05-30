import type { Category, Transaction } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `categories`, `transactions`, and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listCategories(): Category[] {
  // TODO: return all categories
  return []
}

export function findCategory(_id: string): Category | undefined {
  // TODO: look up a category by id
  return undefined
}

export function listTransactions(_filter?: { categoryId?: string | null }): Transaction[] {
  // TODO: return transactions, applying optional categoryId filter
  return []
}

export function createTransaction(_input: {
  categoryId: string
  description?: string
  amount: number
}): Transaction {
  // TODO: append a new transaction with a fresh id and return it
  return { id: '', categoryId: '', description: '', amount: 0 }
}

export function findTransaction(_id: string): Transaction | undefined {
  // TODO: look up a transaction by id
  return undefined
}

export function deleteTransaction(_id: string): boolean {
  // TODO: remove the transaction; return whether it existed
  return false
}
