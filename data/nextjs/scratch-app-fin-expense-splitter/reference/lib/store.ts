import type { Expense, Person } from './types'

// In-memory server store for the API routes. SEPARATE from the client SplitProvider state.
// Tests call __reset() in beforeEach for isolation.

let people: Person[] = []
let expenses: Expense[] = []
let nextPersonId = 1
let nextExpenseId = 1

function seed(): void {
  people = [
    { id: 'u1', name: 'Alice' },
    { id: 'u2', name: 'Bob' },
    { id: 'u3', name: 'Carol' },
  ]
  expenses = [
    { id: 'e1', description: 'Dinner', amount: 90, paidBy: 'u1' },
    { id: 'e2', description: 'Taxi', amount: 30, paidBy: 'u2' },
    { id: 'e3', description: 'Hotel', amount: 60, paidBy: 'u1' },
  ]
  nextPersonId = 4
  nextExpenseId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listPeople(): Person[] {
  return people.slice()
}

export function createPerson(input: { name: string }): Person {
  const person: Person = { id: `u${nextPersonId++}`, name: input.name }
  people.push(person)
  return person
}

export function findPerson(id: string): Person | undefined {
  return people.find((p) => p.id === id)
}

export function listExpenses(filter?: { paidBy?: string | null }): Expense[] {
  let out = expenses.slice()
  const paidBy = filter?.paidBy
  if (paidBy) out = out.filter((e) => e.paidBy === paidBy)
  return out
}

export function createExpense(input: {
  description: string
  amount: number
  paidBy: string
}): Expense {
  const expense: Expense = {
    id: `e${nextExpenseId++}`,
    description: input.description,
    amount: input.amount,
    paidBy: input.paidBy,
  }
  expenses.push(expense)
  return expense
}

export function findExpense(id: string): Expense | undefined {
  return expenses.find((e) => e.id === id)
}

export function deleteExpense(id: string): boolean {
  const idx = expenses.findIndex((e) => e.id === id)
  if (idx === -1) return false
  expenses.splice(idx, 1)
  return true
}
