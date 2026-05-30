'use client'
import { useApp } from '../components/AppStateProvider'
import type { Meal } from '../lib/types'

export type Totals = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export function sumMeals(_meals: Meal[]): Totals {
  // TODO: sum calories + macros across meals
  return { calories: 0, protein: 0, carbs: 0, fat: 0 }
}

export function mealsForDate(_meals: Meal[], _date: string): Meal[] {
  // TODO: filter to meals on the given date
  return []
}

export function groupByDate(_meals: Meal[]): { date: string; meals: Meal[] }[] {
  // TODO: group meals by date, newest first
  return []
}

export function useNutrition() {
  const { meals, goal, today } = useApp()
  const todayMeals = mealsForDate(meals, today)
  const todayTotals = sumMeals(todayMeals)
  const remaining = goal.calories - todayTotals.calories
  const days = groupByDate(meals)
  return { todayMeals, todayTotals, remaining, days }
}
