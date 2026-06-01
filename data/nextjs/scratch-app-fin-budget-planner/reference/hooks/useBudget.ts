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

export function spentByCategory(expenses: Expense[]): Record<string, number> {
  const out: Record<string, number> = {}
  expenses.forEach((e) => {
    out[e.categoryId] = (out[e.categoryId] ?? 0) + e.amount
  })
  return out
}

export function summarize(categories: Category[], expenses: Expense[]): CategorySummary[] {
  const spent = spentByCategory(expenses)
  return categories.map((c) => {
    const actual = spent[c.id] ?? 0
    return {
      id: c.id,
      name: c.name,
      planned: c.planned,
      actual,
      remaining: c.planned - actual,
      overBudget: actual > c.planned,
    }
  })
}

export function totalsOf(summaries: CategorySummary[]): BudgetTotals {
  let totalPlanned = 0
  let totalActual = 0
  let overBudgetCount = 0
  summaries.forEach((s) => {
    totalPlanned += s.planned
    totalActual += s.actual
    if (s.overBudget) overBudgetCount += 1
  })
  return {
    totalPlanned,
    totalActual,
    totalRemaining: totalPlanned - totalActual,
    overBudgetCount,
  }
}

export function useBudgetSummary() {
  const { categories, expenses } = useBudget()
  const summaries = summarize(categories, expenses)
  const totals = totalsOf(summaries)
  return { summaries, totals }
}
