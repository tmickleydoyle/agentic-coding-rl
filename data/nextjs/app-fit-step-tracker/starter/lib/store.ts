import type { StepEntry } from './types'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let entries: StepEntry[] = []
let goal = 10000
let nextId = 1

function seed(): void {
  entries = [
    { id: 's1', date: '2026-05-25', steps: 12000 },
    { id: 's2', date: '2026-05-26', steps: 8000 },
    { id: 's3', date: '2026-05-27', steps: 11000 },
  ]
  goal = 10000
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listEntries(): StepEntry[] {
  return entries.slice()
}

export function getGoal(): number {
  return goal
}

export function setGoal(value: number): number {
  goal = value
  return goal
}

export function findByDate(date: string): StepEntry | undefined {
  return entries.find((e) => e.date === date)
}

// Upsert: if an entry exists for the date, replace its steps; otherwise create one.
export function upsertEntry(input: { date: string; steps: number }): StepEntry {
  const existing = entries.find((e) => e.date === input.date)
  if (existing) {
    existing.steps = input.steps
    return existing
  }
  const entry: StepEntry = { id: `s${nextId++}`, date: input.date, steps: input.steps }
  entries.push(entry)
  return entry
}

export function deleteEntry(id: string): boolean {
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return false
  entries.splice(idx, 1)
  return true
}
