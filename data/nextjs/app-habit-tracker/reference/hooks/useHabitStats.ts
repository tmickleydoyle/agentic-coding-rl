'use client'
import { useHabits } from '../components/HabitProvider'
import type { Habit } from '../lib/types'

export function isDoneToday(habit: Habit, today: string): boolean {
  return habit.history.includes(today)
}

function prevDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

// Consecutive completed days ending at `today` (or the day before if not done today).
export function currentStreak(habit: Habit, today: string): number {
  const set = new Set(habit.history)
  let cursor = set.has(today) ? today : prevDay(today)
  let streak = 0
  while (set.has(cursor)) {
    streak += 1
    cursor = prevDay(cursor)
  }
  return streak
}

export function completionRate(habits: Habit[], today: string): number {
  if (habits.length === 0) return 0
  const done = habits.filter((h) => isDoneToday(h, today)).length
  return Math.round((done / habits.length) * 100)
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
