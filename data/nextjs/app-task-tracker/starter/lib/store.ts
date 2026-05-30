import type { Project, Task } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `tasks`, `projects`, and id counters; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listTasks(_filter?: { status?: string | null; projectId?: string | null }): Task[] {
  // TODO: return tasks, applying optional status + projectId filters
  return []
}

export function createTask(_input: { title: string; projectId?: string; dueDate?: string | null }): Task {
  // TODO: append a new task with a fresh id and return it
  return { id: '', title: '', projectId: '', done: false, dueDate: null }
}

export function findTask(_id: string): Task | undefined {
  // TODO: look up a task by id
  return undefined
}

export function updateTask(
  _id: string,
  _patch: { done?: boolean; title?: string; projectId?: string; dueDate?: string | null },
): Task | undefined {
  // TODO: apply the patch and return the updated task, or undefined if absent
  return undefined
}

export function deleteTask(_id: string): boolean {
  // TODO: remove the task; return whether it existed
  return false
}

export function listProjects(): Project[] {
  // TODO: return all projects
  return []
}

export function createProject(_input: { name: string }): Project {
  // TODO: append a new project with a fresh id and return it
  return { id: '', name: '' }
}
