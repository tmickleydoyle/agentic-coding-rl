import type { Hire, OnboardTask } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level hires/tasks and id counters; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listHires(): Hire[] {
  // TODO: return all hires
  return []
}

export function findHire(_id: string): Hire | undefined {
  // TODO: look up a hire by id
  return undefined
}

export function tasksForHire(_hireId: string): OnboardTask[] {
  // TODO: return the hire's tasks
  return []
}

export function hireProgress(_hireId: string): number {
  // TODO: percent of the hire's tasks that are done (0 when no tasks)
  return 0
}

export function hiresWithProgress(): Array<Hire & { total: number; done: number; percent: number }> {
  // TODO: return hires each annotated with total/done/percent
  return []
}

export function createHire(_input: { name: string; role?: string; startDate?: string }): Hire {
  // TODO: append a new hire (default role 'New Hire') with a fresh id and return it
  return { id: '', name: '', role: '', startDate: '' }
}

export function listTasks(_filter?: { hireId?: string | null }): OnboardTask[] {
  // TODO: return tasks, applying the optional hireId filter
  return []
}

export function findTask(_id: string): OnboardTask | undefined {
  // TODO: look up a task by id
  return undefined
}

export function createTask(_input: { hireId: string; label: string }): OnboardTask {
  // TODO: append a new task (done false) with a fresh id and return it
  return { id: '', hireId: '', label: '', done: false }
}

export function setTaskDone(_id: string, _done: boolean): OnboardTask | undefined {
  // TODO: set the task's done flag and return it, or undefined if absent
  return undefined
}
