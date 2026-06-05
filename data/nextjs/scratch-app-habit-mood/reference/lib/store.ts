import type { MoodEntry } from './types'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let entries: MoodEntry[] = []
let nextId = 1

function seed(): void {
  entries = [
    { id: 'm1', date: '2026-05-25', score: 4, triggers: ['sleep'] },
    { id: 'm2', date: '2026-05-26', score: 2, triggers: ['work', 'stress'] },
    { id: 'm3', date: '2026-05-27', score: 5, triggers: ['exercise'] },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listEntries(): MoodEntry[] {
  return entries.map((e) => ({ ...e, triggers: e.triggers.slice() }))
}

export function upsertEntry(input: {
  date: string
  score: number
  triggers: string[]
}): MoodEntry {
  const existing = entries.find((e) => e.date === input.date)
  if (existing) {
    existing.score = input.score
    existing.triggers = input.triggers.slice()
    return { ...existing, triggers: existing.triggers.slice() }
  }
  const entry: MoodEntry = {
    id: `m${nextId++}`,
    date: input.date,
    score: input.score,
    triggers: input.triggers.slice(),
  }
  entries.push(entry)
  return { ...entry, triggers: entry.triggers.slice() }
}

export function deleteEntry(id: string): boolean {
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return false
  entries.splice(idx, 1)
  return true
}
