import type { Category, Expense, Trip } from './types'

// In-memory server store for the API routes. SEPARATE from the client provider state.
// Tests call __reset() in beforeEach so each test starts from the same seed.

let trips: Trip[] = []
let expenses: Expense[] = []
let nextExpenseId = 1

function seed(): void {
  trips = [
    { id: 'tr1', name: 'Paris', days: 3 },
    { id: 'tr2', name: 'Lisbon', days: 2 },
  ]
  expenses = [
    { id: 'e1', tripId: 'tr1', day: 1, category: 'lodging', amount: 200, note: 'Hotel' },
    { id: 'e2', tripId: 'tr1', day: 1, category: 'food', amount: 50, note: 'Dinner' },
    { id: 'e3', tripId: 'tr1', day: 2, category: 'food', amount: 30, note: 'Lunch' },
    { id: 'e4', tripId: 'tr2', day: 1, category: 'transport', amount: 80, note: 'Train' },
  ]
  nextExpenseId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listTrips(): Trip[] {
  return trips.slice()
}

export function findTrip(id: string): Trip | undefined {
  return trips.find((t) => t.id === id)
}

export function listExpenses(filter?: { tripId?: string | null; category?: string | null }): Expense[] {
  let out = expenses.slice()
  const tripId = filter?.tripId
  if (tripId) out = out.filter((e) => e.tripId === tripId)
  const category = filter?.category
  if (category) out = out.filter((e) => e.category === category)
  return out
}

export function findExpense(id: string): Expense | undefined {
  return expenses.find((e) => e.id === id)
}

export function createExpense(input: {
  tripId: string
  day: number
  category: Category
  amount: number
  note?: string
}): Expense {
  const expense: Expense = {
    id: `e${nextExpenseId++}`,
    tripId: input.tripId,
    day: input.day,
    category: input.category,
    amount: input.amount,
    note: input.note ?? '',
  }
  expenses.push(expense)
  return expense
}

export function deleteExpense(id: string): boolean {
  const idx = expenses.findIndex((e) => e.id === id)
  if (idx === -1) return false
  expenses.splice(idx, 1)
  return true
}

export function tripTotal(tripId: string): number {
  return expenses
    .filter((e) => e.tripId === tripId)
    .reduce((sum, e) => sum + e.amount, 0)
}
