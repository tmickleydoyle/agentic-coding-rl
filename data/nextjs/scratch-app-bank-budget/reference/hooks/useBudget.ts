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

export function spentByCategory(transactions: Transaction[]): Record<string, number> {
  const out: Record<string, number> = {}
  transactions.forEach((t) => {
    out[t.categoryId] = (out[t.categoryId] ?? 0) + t.amount
  })
  return out
}

export function summarize(categories: Category[], transactions: Transaction[]): CategorySummary[] {
  const spent = spentByCategory(transactions)
  return categories.map((c) => {
    const total = spent[c.id] ?? 0
    return {
      id: c.id,
      name: c.name,
      limit: c.limit,
      spent: total,
      remaining: c.limit - total,
      overLimit: total > c.limit,
    }
  })
}

export function totalsOf(summaries: CategorySummary[]): BudgetTotals {
  let totalLimit = 0
  let totalSpent = 0
  let overLimitCount = 0
  summaries.forEach((s) => {
    totalLimit += s.limit
    totalSpent += s.spent
    if (s.overLimit) overLimitCount += 1
  })
  return {
    totalLimit,
    totalSpent,
    totalRemaining: totalLimit - totalSpent,
    overLimitCount,
  }
}

export function useBudgetSummary() {
  const { categories, transactions } = useBudget()
  const summaries = summarize(categories, transactions)
  const totals = totalsOf(summaries)
  return { summaries, totals }
}
