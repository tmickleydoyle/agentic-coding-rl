'use client'
import { useBudget } from '../components/BudgetProvider'
import type { Category, Transaction } from '../lib/types'

export type CategorySummary = {
  id: string
  name: string
  limit: number
  spent: number
  remaining: number
  overLimit: boolean
}

export type BudgetTotals = {
  totalLimit: number
  totalSpent: number
  totalRemaining: number
  overLimitCount: number
}

export function summarize(_categories: Category[], _transactions: Transaction[]): CategorySummary[] {
  // TODO: per category compute spent (sum of its transactions), remaining, and overLimit
  return []
}

export function totalsOf(_summaries: CategorySummary[]): BudgetTotals {
  // TODO: total up limit/spent/remaining and count over-limit categories
  return { totalLimit: 0, totalSpent: 0, totalRemaining: 0, overLimitCount: 0 }
}

export function useBudgetSummary() {
  const { categories, transactions } = useBudget()
  const summaries = summarize(categories, transactions)
  const totals = totalsOf(summaries)
  return { summaries, totals }
}
