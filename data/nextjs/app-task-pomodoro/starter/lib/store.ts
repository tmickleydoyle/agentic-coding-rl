import type { Task } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `tasks` + an id counter; seed them; provide __reset() to re-seed.
// Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listTasks(_filter?: { done?: string | null }): Task[] {
  // TODO: return tasks, applying optional done filter
  return []
}

export function createTask(_input: { title: string }): Task {
  // TODO: append a new task (sessions 0, done false) with a fresh id and return it
  return { id: '', title: '', sessions: 0, done: false }
}

export function findTask(_id: string): Task | undefined {
  // TODO: look up a task by id
  return undefined
}

export function updateTask(
  _id: string,
  _patch: { done?: boolean; session?: boolean },
): Task | undefined {
  // TODO: apply the patch (set done and/or increment sessions); return the task or undefined
  return undefined
}

export function toggleTaskDone(_id: string): Task | undefined {
  // TODO: flip done and return the task or undefined
  return undefined
}

export function deleteTask(_id: string): boolean {
  // TODO: remove the task; return whether it existed
  return false
}
