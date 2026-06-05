'use client'
import { useExpenses } from '../components/ExpensesProvider'
import type { Category, Expense } from '../lib/types'
import { CATEGORIES } from '../lib/types'

export function tripTotal(expenses: Expense[], tripId: string): number {
  return expenses
    .filter((e) => e.tripId === tripId)
    .reduce((sum, e) => sum + e.amount, 0)
}

export type CategoryTotal = { category: Category; total: number }

export function byCategory(expenses: Expense[], tripId: string): CategoryTotal[] {
  const tripExpenses = expenses.filter((e) => e.tripId === tripId)
  return CATEGORIES.map((category) => ({
    category,
    total: tripExpenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0),
  })).filter((c) => c.total > 0)
}

export type DayTotal = { day: number; expenses: Expense[]; total: number }

export function byDay(expenses: Expense[], tripId: string, days: number): DayTotal[] {
  const out: DayTotal[] = []
  for (let d = 1; d <= days; d += 1) {
    const dayExpenses = expenses.filter((e) => e.tripId === tripId && e.day === d)
    out.push({
      day: d,
      expenses: dayExpenses,
      total: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
    })
  }
  return out
}

export function useTripExpenses(tripId: string | null) {
  const { trips, expenses } = useExpenses()
  const trip = tripId ? trips.find((t) => t.id === tripId) ?? null : null
  const days = trip ? byDay(expenses, trip.id, trip.days) : []
  const categories = trip ? byCategory(expenses, trip.id) : []
  const total = trip ? tripTotal(expenses, trip.id) : 0
  return { trip, days, categories, total }
}
