import type { Category, Expense } from './types'

// In-memory server store for the API routes. SEPARATE from the client
// BudgetProvider state. Tests call __reset() in beforeEach for isolation.

let categories: Category[] = []
let expenses: Expense[] = []
let nextCategoryId = 1
let nextExpenseId = 1

function seed(): void {
  categories = [
    { id: 'c1', name: 'Rent', planned: 1200 },
    { id: 'c2', name: 'Groceries', planned: 400 },
    { id: 'c3', name: 'Transport', planned: 150 },
  ]
  expenses = [
    { id: 'e1', categoryId: 'c1', amount: 1200, note: 'May rent' },
    { id: 'e2', categoryId: 'c2', amount: 320, note: 'Weekly shop' },
    { id: 'e3', categoryId: 'c2', amount: 140, note: 'Costco' },
  ]
  nextCategoryId = 4
  nextExpenseId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listCategories(): Category[] {
  return categories.slice()
}

export function createCategory(input: { name: string; planned?: number }): Category {
  const category: Category = {
    id: `c${nextCategoryId++}`,
    name: input.name,
    planned: input.planned ?? 0,
  }
  categories.push(category)
  return category
}

export function findCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function listExpenses(filter?: { categoryId?: string | null }): Expense[] {
  let out = expenses.slice()
  const categoryId = filter?.categoryId
  if (categoryId) out = out.filter((e) => e.categoryId === categoryId)
  return out
}

export function createExpense(input: {
  categoryId: string
  amount: number
  note?: string
}): Expense {
  const expense: Expense = {
    id: `e${nextExpenseId++}`,
    categoryId: input.categoryId,
    amount: input.amount,
    note: input.note ?? '',
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
