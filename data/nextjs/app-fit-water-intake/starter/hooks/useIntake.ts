'use client'
import { useWater } from '../components/WaterProvider'
import type { DayTotal, Drink } from '../lib/types'

export function totalFor(_drinks: Drink[], _date: string): number {
  // TODO: sum of amounts on a date.
  return 0
}

export function percentOf(_total: number, _goal: number): number {
  // TODO: min(100, round(total/goal*100)).
  return 0
}

export function dayTotals(_drinks: Drink[]): DayTotal[] {
  // TODO: per-day totals, most-recent date first.
  return []
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
