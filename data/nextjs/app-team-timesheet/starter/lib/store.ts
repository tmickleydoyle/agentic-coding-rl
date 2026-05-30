import type { Day, Entry, Project } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level projects/entries and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listProjects(): Project[] {
  // TODO: return all projects
  return []
}

export function listEntries(_filter?: { projectId?: string | null; day?: string | null }): Entry[] {
  // TODO: return entries, applying optional projectId + day filters
  return []
}

export function totalsByProject(): Record<string, number> {
  // TODO: sum hours per project id (include every project with 0)
  return {}
}

export function weekTotal(): number {
  // TODO: grand total of all entry hours
  return 0
}

export function createEntry(_input: { projectId: string; day: Day; hours: number }): Entry {
  // TODO: append a new unsubmitted entry (hours clamped to >= 0) with a fresh id
  return { id: '', projectId: '', day: 'mon', hours: 0, submitted: false }
}

export function submitEntry(_id: string): Entry | undefined {
  // TODO: mark the entry submitted; return it or undefined if absent
  return undefined
}

export function deleteEntry(_id: string): boolean {
  // TODO: remove the entry; return whether it existed
  return false
}
