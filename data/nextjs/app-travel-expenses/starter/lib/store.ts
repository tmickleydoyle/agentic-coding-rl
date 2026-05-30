import type { Category, Expense, Trip } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level trips/expenses + an id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listTrips(): Trip[] {
  // TODO: return all trips
  return []
}

export function findTrip(_id: string): Trip | undefined {
  // TODO: look up a trip by id
  return undefined
}

export function listExpenses(_filter?: { tripId?: string | null; category?: string | null }): Expense[] {
  // TODO: return expenses, optionally filtered by tripId and/or category
  return []
}

export function findExpense(_id: string): Expense | undefined {
  // TODO: look up an expense by id
  return undefined
}

export function createExpense(_input: {
  tripId: string
  day: number
  category: Category
  amount: number
  note?: string
}): Expense {
  // TODO: append a new expense with a fresh id and return it
  return { id: '', tripId: '', day: 1, category: 'other', amount: 0, note: '' }
}

export function deleteExpense(_id: string): boolean {
  // TODO: remove the expense; return whether it existed
  return false
}

export function tripTotal(_tripId: string): number {
  // TODO: sum the amounts of all expenses for the trip
  return 0
}
