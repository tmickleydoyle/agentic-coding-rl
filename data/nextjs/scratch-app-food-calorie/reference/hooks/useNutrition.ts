'use client'
import { useApp } from '../components/AppStateProvider'
import type { Meal } from '../lib/types'

export type Totals = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export function sumMeals(meals: Meal[]): Totals {
  const totals: Totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }
  meals.forEach((m) => {
    totals.calories += m.calories
    totals.protein += m.protein
    totals.carbs += m.carbs
    totals.fat += m.fat
  })
  return totals
}

export function mealsForDate(meals: Meal[], date: string): Meal[] {
  return meals.filter((m) => m.date === date)
}

export function groupByDate(meals: Meal[]): { date: string; meals: Meal[] }[] {
  const map: Record<string, Meal[]> = {}
  meals.forEach((m) => {
    if (!map[m.date]) map[m.date] = []
    map[m.date].push(m)
  })
  const dates = Object.keys(map).sort((a, b) => (a < b ? 1 : -1))
  return dates.map((date) => ({ date, meals: map[date] }))
}

export function useNutrition() {
  const { meals, goal, today } = useApp()
  const todayMeals = mealsForDate(meals, today)
  const todayTotals = sumMeals(todayMeals)
  const remaining = goal.calories - todayTotals.calories
  const days = groupByDate(meals)
  return { todayMeals, todayTotals, remaining, days }
}
