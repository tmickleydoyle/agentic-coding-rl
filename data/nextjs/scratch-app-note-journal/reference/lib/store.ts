import type { Entry, Mood } from './types'
import { TODAY } from './types'

let entries: Entry[] = []
let nextId = 1

function seed(): void {
  entries = [
    { id: 'e1', date: '2026-05-27', body: 'Shipped the build', mood: 'happy' },
    { id: 'e2', date: '2026-05-28', body: 'Quiet day', mood: 'neutral' },
    { id: 'e3', date: '2026-05-28', body: 'Long meetings', mood: 'sad' },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listEntries(filter?: { mood?: string | null; date?: string | null }): Entry[] {
  let out = entries.slice()
  const mood = filter?.mood
  if (mood) out = out.filter((e) => e.mood === mood)
  const date = filter?.date
  if (date) out = out.filter((e) => e.date === date)
  return out
}

export function summary(): { happy: number; neutral: number; sad: number; total: number } {
  const out = { happy: 0, neutral: 0, sad: 0, total: entries.length }
  entries.forEach((e) => {
    out[e.mood] += 1
  })
  return out
}

const VALID_MOODS: Mood[] = ['happy', 'neutral', 'sad']

export function createEntry(input: { body: string; mood?: string; date?: string }): Entry {
  const mood: Mood =
    typeof input.mood === 'string' && (VALID_MOODS as string[]).includes(input.mood)
      ? (input.mood as Mood)
      : 'neutral'
  const entry: Entry = {
    id: `e${nextId++}`,
    date: input.date && input.date.length > 0 ? input.date : TODAY,
    body: input.body,
    mood,
  }
  entries.push(entry)
  return entry
}

export function findEntry(id: string): Entry | undefined {
  return entries.find((e) => e.id === id)
}

export function updateEntry(id: string, patch: { body?: string; mood?: Mood }): Entry | undefined {
  const entry = entries.find((e) => e.id === id)
  if (!entry) return undefined
  if (typeof patch.body === 'string') entry.body = patch.body
  if (patch.mood && (VALID_MOODS as string[]).includes(patch.mood)) entry.mood = patch.mood
  return entry
}

export function deleteEntry(id: string): boolean {
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return false
  entries.splice(idx, 1)
  return true
}
