import type { Expense, Person } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `people`, `expenses`, and id counters; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listPeople(): Person[] {
  // TODO: return all people
  return []
}

export function createPerson(_input: { name: string }): Person {
  // TODO: append a new person with a fresh id and return it
  return { id: '', name: '' }
}

export function findPerson(_id: string): Person | undefined {
  // TODO: look up a person by id
  return undefined
}

export function listExpenses(_filter?: { paidBy?: string | null }): Expense[] {
  // TODO: return expenses, applying optional paidBy filter
  return []
}

export function createExpense(_input: {
  description: string
  amount: number
  paidBy: string
}): Expense {
  // TODO: append a new expense with a fresh id and return it
  return { id: '', description: '', amount: 0, paidBy: '' }
}

export function findExpense(_id: string): Expense | undefined {
  // TODO: look up an expense by id
  return undefined
}

export function deleteExpense(_id: string): boolean {
  // TODO: remove the expense; return whether it existed
  return false
}
