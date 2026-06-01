import type { Habit } from './types'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let habits: Habit[] = []
let nextId = 1

function seed(): void {
  habits = [
    { id: 'h1', name: 'Drink water', history: ['2026-05-26', '2026-05-27', '2026-05-28'] },
    { id: 'h2', name: 'Exercise', history: ['2026-05-27', '2026-05-28'] },
    { id: 'h3', name: 'Read', history: ['2026-05-25', '2026-05-26'] },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listHabits(): Habit[] {
  return habits.map((h) => ({ ...h, history: h.history.slice() }))
}

export function findHabit(id: string): Habit | undefined {
  return habits.find((h) => h.id === id)
}

export function addHabit(name: string): Habit {
  const habit: Habit = { id: `h${nextId++}`, name, history: [] }
  habits.push(habit)
  return habit
}

export function toggleDate(id: string, date: string): Habit | undefined {
  const habit = habits.find((h) => h.id === id)
  if (!habit) return undefined
  if (habit.history.includes(date)) {
    habit.history = habit.history.filter((d) => d !== date)
  } else {
    habit.history = [...habit.history, date].sort()
  }
  return habit
}

export function deleteHabit(id: string): boolean {
  const idx = habits.findIndex((h) => h.id === id)
  if (idx === -1) return false
  habits.splice(idx, 1)
  return true
}
