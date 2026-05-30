'use client'
import { useHabits } from '../components/HabitProvider'
import type { Habit } from '../lib/types'

export function isDoneToday(habit: Habit, today: string): boolean {
  return habit.history.includes(today)
}

export function currentStreak(_habit: Habit, _today: string): number {
  // TODO: consecutive completed days ending at today (or the day before if not done today).
  return 0
}

export function completionRate(_habits: Habit[], _today: string): number {
  // TODO: percent of habits done today, rounded.
  return 0
}

export function useHabitStats() {
  const { habits, today } = useHabits()
  const doneToday = habits.filter((h) => isDoneToday(h, today)).length
  const totalHabits = habits.length
  const rate = completionRate(habits, today)
  let longestStreak = 0
  habits.forEach((h) => {
    const s = currentStreak(h, today)
    if (s > longestStreak) longestStreak = s
  })
  return { doneToday, totalHabits, completionRate: rate, longestStreak }
}
