import type { Quadrant, Task } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `tasks` + an id counter; seed them; provide __reset() to re-seed.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listTasks(_filter?: { quadrant?: Quadrant | null }): Task[] {
  // TODO: return tasks, applying optional quadrant filter (computed from flags)
  return []
}

export function createTask(_input: {
  title: string
  urgent?: boolean
  important?: boolean
}): Task {
  // TODO: append a new task with a fresh id and return it
  return { id: '', title: '', urgent: false, important: false }
}

export function findTask(_id: string): Task | undefined {
  // TODO: look up a task by id
  return undefined
}

export function updateTask(
  _id: string,
  _patch: { quadrant?: Quadrant; urgent?: boolean; important?: boolean },
): Task | undefined {
  // TODO: apply the patch (quadrant sets both flags; urgent/important set individually)
  return undefined
}

export function deleteTask(_id: string): boolean {
  // TODO: remove the task; return whether it existed
  return false
}
