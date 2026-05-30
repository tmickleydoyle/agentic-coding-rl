'use client'
import { useExpenses } from '../components/ExpensesProvider'
import type { Category, Expense, Trip } from '../lib/types'

export function tripTotal(_expenses: Expense[], _tripId: string): number {
  // TODO: sum the amounts of all expenses for the trip
  return 0
}

export type CategoryTotal = { category: Category; total: number }

export function byCategory(_expenses: Expense[], _tripId: string): CategoryTotal[] {
  // TODO: total per non-zero category in CATEGORIES order
  return []
}

export type DayTotal = { day: number; expenses: Expense[]; total: number }

export function byDay(_expenses: Expense[], _tripId: string, _days: number): DayTotal[] {
  // TODO: group + total per day 1..days
  return []
}

export function useTripExpenses(tripId: string | null) {
  const { trips } = useExpenses()
  const trip: Trip | null = tripId ? trips.find((t) => t.id === tripId) ?? null : null
  // TODO: compute days + categories + total
  return { trip, days: [] as DayTotal[], categories: [] as CategoryTotal[], total: 0 }
}
