'use client'
import { useBudget } from '../components/BudgetProvider'
import type { Category, Expense } from '../lib/types'

export type CategorySummary = {
  id: string
  name: string
  planned: number
  actual: number
  remaining: number
  overBudget: boolean
}

export type BudgetTotals = {
  totalPlanned: number
  totalActual: number
  totalRemaining: number
  overBudgetCount: number
}

export function summarize(_categories: Category[], _expenses: Expense[]): CategorySummary[] {
  // TODO: per category compute actual (sum of its expenses), remaining, and overBudget
  return []
}

export function totalsOf(_summaries: CategorySummary[]): BudgetTotals {
  // TODO: total up planned/actual/remaining and count over-budget categories
  return { totalPlanned: 0, totalActual: 0, totalRemaining: 0, overBudgetCount: 0 }
}

export function useBudgetSummary() {
  const { categories, expenses } = useBudget()
  const summaries = summarize(categories, expenses)
  const totals = totalsOf(summaries)
  return { summaries, totals }
}
