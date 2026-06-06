import { Habit, Completion } from './types'

export const TODAY = '2026-06-06'

const SEED_HABITS: Habit[] = [
  { id: 'h1', name: 'Push-ups', color: 'red' },
  { id: 'h2', name: 'Journaling', color: 'blue' },
  { id: 'h3', name: 'Cold Shower', color: 'cyan' },
]

const SEED_COMPLETIONS: Completion[] = [
  { id: 'c1', habitId: 'h1', date: '2026-06-06' },
  { id: 'c2', habitId: 'h1', date: '2026-06-05' },
  { id: 'c3', habitId: 'h1', date: '2026-06-04' },
  { id: 'c4', habitId: 'h2', date: '2026-06-06' },
  { id: 'c5', habitId: 'h2', date: '2026-06-04' },
  { id: 'c6', habitId: 'h3', date: '2026-06-01' },
]

let habits: Habit[] = SEED_HABITS.map(h => ({ ...h }))
let completions: Completion[] = SEED_COMPLETIONS.map(c => ({ ...c }))

export function getHabits(): Habit[] { return [...habits] }

export function addHabit(data: Omit<Habit, 'id'>): Habit {
  const h: Habit = { id: `h${Date.now()}`, ...data }
  habits.push(h)
  return h
}

export function getCompletions(): Completion[] { return [...completions] }

export function addCompletion(data: { habitId: string; date: string }): Completion {
  const c: Completion = { id: `c${Date.now()}`, ...data }
  completions.push(c)
  return c
}

export function computeStreak(habitId: string, today: string): number {
  const dates = completions
    .filter(c => c.habitId === habitId)
    .map(c => c.date)
    .sort()
    .reverse()

  if (dates.length === 0) return 0

  const todayMs = new Date(today).getTime()
  const yesterdayStr = new Date(todayMs - 86400000).toISOString().slice(0, 10)

  if (dates[0] !== today && dates[0] !== yesterdayStr) return 0

  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]).getTime()
    const curr = new Date(dates[i]).getTime()
    if (prev - curr === 86400000) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export function __reset(): void {
  habits = SEED_HABITS.map(h => ({ ...h }))
  completions = SEED_COMPLETIONS.map(c => ({ ...c }))
}
