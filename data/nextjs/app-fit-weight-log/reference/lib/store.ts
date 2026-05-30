import type { WeightEntry } from './types'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let entries: WeightEntry[] = []
let goal = 75
let nextId = 1

function seed(): void {
  entries = [
    { id: 'g1', date: '2026-05-01', weight: 80 },
    { id: 'g2', date: '2026-05-08', weight: 79.5 },
    { id: 'g3', date: '2026-05-15', weight: 79 },
  ]
  goal = 75
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listEntries(): WeightEntry[] {
  return entries.slice()
}

export function getGoal(): number {
  return goal
}

export function setGoal(value: number): number {
  goal = value
  return goal
}

export function createEntry(input: { date: string; weight: number }): WeightEntry {
  const entry: WeightEntry = {
    id: `g${nextId++}`,
    date: input.date,
    weight: input.weight,
  }
  entries.push(entry)
  return entry
}

export function deleteEntry(id: string): boolean {
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return false
  entries.splice(idx, 1)
  return true
}

// The latest (chronologically last) entry, or undefined.
export function latestEntry(): WeightEntry | undefined {
  return entries.length === 0 ? undefined : entries[entries.length - 1]
}
