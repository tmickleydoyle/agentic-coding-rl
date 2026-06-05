import type { Category, Transaction } from './types'

// In-memory server store for the API routes. SEPARATE from the client
// BudgetProvider state. Tests call __reset() in beforeEach for isolation.

let categories: Category[] = []
let transactions: Transaction[] = []
let nextTransactionId = 1

function seed(): void {
  categories = [
    { id: 'c1', name: 'Dining', limit: 300 },
    { id: 'c2', name: 'Shopping', limit: 500 },
    { id: 'c3', name: 'Utilities', limit: 200 },
  ]
  transactions = [
    { id: 't1', categoryId: 'c1', description: 'Pizza night', amount: 60 },
    { id: 't2', categoryId: 'c1', description: 'Sushi', amount: 120 },
    { id: 't3', categoryId: 'c2', description: 'New shoes', amount: 540 },
    { id: 't4', categoryId: 'c3', description: 'Electricity', amount: 90 },
    { id: 't5', categoryId: 'c3', description: 'Water', amount: 60 },
  ]
  nextTransactionId = 6
}

seed()

export function __reset(): void {
  seed()
}

export function listCategories(): Category[] {
  return categories.slice()
}

export function findCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function listTransactions(filter?: { categoryId?: string | null }): Transaction[] {
  let out = transactions.slice()
  const categoryId = filter?.categoryId
  if (categoryId) out = out.filter((t) => t.categoryId === categoryId)
  return out
}

export function createTransaction(input: {
  categoryId: string
  description?: string
  amount: number
}): Transaction {
  const txn: Transaction = {
    id: `t${nextTransactionId++}`,
    categoryId: input.categoryId,
    description: input.description ?? '',
    amount: input.amount,
  }
  transactions.push(txn)
  return txn
}

export function findTransaction(id: string): Transaction | undefined {
  return transactions.find((t) => t.id === id)
}

export function deleteTransaction(id: string): boolean {
  const idx = transactions.findIndex((t) => t.id === id)
  if (idx === -1) return false
  transactions.splice(idx, 1)
  return true
}
