'use client'
import { useWater } from '../components/WaterProvider'
import type { DayTotal, Drink } from '../lib/types'

export function totalFor(drinks: Drink[], date: string): number {
  let total = 0
  drinks.forEach((d) => {
    if (d.date === date) total += d.amount
  })
  return total
}

export function percentOf(total: number, goal: number): number {
  if (goal <= 0) return 0
  return Math.min(100, Math.round((total / goal) * 100))
}

// Per-day totals, most-recent date first.
export function dayTotals(drinks: Drink[]): DayTotal[] {
  const byDate: Record<string, number> = {}
  drinks.forEach((d) => {
    byDate[d.date] = (byDate[d.date] ?? 0) + d.amount
  })
  return Object.keys(byDate)
    .sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
    .map((date) => ({ date, total: byDate[date] }))
}

export function useIntake() {
  const { drinks, goal, today } = useWater()
  const todayDrinks = drinks.filter((d) => d.date === today)
  const todayTotal = totalFor(drinks, today)
  const percent = percentOf(todayTotal, goal)
  const remaining = Math.max(0, goal - todayTotal)
  const met = todayTotal >= goal
  const totals = dayTotals(drinks)
  return { todayDrinks, todayTotal, percent, remaining, met, totals }
}
