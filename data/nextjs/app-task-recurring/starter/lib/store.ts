import type { HistoryEntry, Schedule, Task } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `tasks`, `history`, and id counters; seed them; provide
// __reset() to re-seed. Use TODAY as the reference date.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listTasks(_filter?: { due?: string | null; schedule?: string | null }): Task[] {
  // TODO: return tasks, applying optional due (nextDue <= TODAY) + schedule filters
  return []
}

export function createTask(_input: { title: string; schedule: Schedule }): Task {
  // TODO: append a new task (nextDue = TODAY) with a fresh id and return it
  return { id: '', title: '', schedule: 'daily', nextDue: '' }
}

export function findTask(_id: string): Task | undefined {
  // TODO: look up a task by id
  return undefined
}

export function completeTask(_id: string): Task | undefined {
  // TODO: record a history entry on TODAY and advance nextDue by the schedule
  return undefined
}

export function deleteTask(_id: string): boolean {
  // TODO: remove the task; return whether it existed
  return false
}

export function listHistory(): HistoryEntry[] {
  // TODO: return all history entries
  return []
}
