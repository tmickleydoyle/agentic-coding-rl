import { Habit, HabitLog } from './types'

export const TODAY = '2026-06-06'

const SEED_HABITS: Habit[] = [
  { id: 'h1', name: 'Morning Run', frequency: 'daily', category: 'Health' },
  { id: 'h2', name: 'Read 30min', frequency: 'daily', category: 'Learning' },
  { id: 'h3', name: 'Weekly Review', frequency: 'weekly', category: 'Productivity' },
]

const SEED_LOGS: HabitLog[] = [
  { id: 'l1', habitId: 'h1', date: '2026-06-06', completed: true },
  { id: 'l2', habitId: 'h2', date: '2026-06-05', completed: true },
  { id: 'l3', habitId: 'h1', date: '2026-06-05', completed: true },
]

let habits: Habit[] = SEED_HABITS.map(h => ({ ...h }))
let logs: HabitLog[] = SEED_LOGS.map(l => ({ ...l }))

export function getHabits(): Habit[] { return [...habits] }

export function addHabit(data: Omit<Habit, 'id'>): Habit {
  const h: Habit = { id: `h${Date.now()}`, ...data }
  habits.push(h)
  return h
}

export function getLogs(): HabitLog[] { return [...logs] }

export function upsertLog(data: { habitId: string; date: string; completed: boolean }): HabitLog {
  const existing = logs.find(l => l.habitId === data.habitId && l.date === data.date)
  if (existing) {
    existing.completed = data.completed
    return existing
  }
  const entry: HabitLog = { id: `l${Date.now()}`, ...data }
  logs.push(entry)
  return entry
}

export function __reset(): void {
  habits = SEED_HABITS.map(h => ({ ...h }))
  logs = SEED_LOGS.map(l => ({ ...l }))
}
