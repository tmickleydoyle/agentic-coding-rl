import type { Entry, Mood } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `entries` and an id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listEntries(_filter?: { mood?: string | null; date?: string | null }): Entry[] {
  // TODO: return entries, applying optional mood + date filters
  return []
}

export function summary(): { happy: number; neutral: number; sad: number; total: number } {
  // TODO: tally moods across all entries
  return { happy: 0, neutral: 0, sad: 0, total: 0 }
}

export function createEntry(_input: { body: string; mood?: string; date?: string }): Entry {
  // TODO: append a new entry with a fresh id (mood defaults neutral, date defaults TODAY)
  return { id: '', date: '', body: '', mood: 'neutral' }
}

export function findEntry(_id: string): Entry | undefined {
  // TODO: look up an entry by id
  return undefined
}

export function updateEntry(_id: string, _patch: { body?: string; mood?: Mood }): Entry | undefined {
  // TODO: apply the patch and return the entry, or undefined if absent
  return undefined
}

export function deleteEntry(_id: string): boolean {
  // TODO: remove the entry; return whether it existed
  return false
}
