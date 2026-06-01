import type { Task } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// PomodoroProvider state. Tests call __reset() in beforeEach so each test starts from
// the same seed.

let tasks: Task[] = []
let nextTaskId = 1

function seed(): void {
  tasks = [
    { id: 't1', title: 'Write report', sessions: 2, done: false },
    { id: 't2', title: 'Review PR', sessions: 0, done: false },
    { id: 't3', title: 'Plan sprint', sessions: 1, done: true },
  ]
  nextTaskId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listTasks(filter?: { done?: string | null }): Task[] {
  let out = tasks.slice()
  const done = filter?.done
  if (done === 'true') out = out.filter((t) => t.done)
  else if (done === 'false') out = out.filter((t) => !t.done)
  return out
}

export function createTask(input: { title: string }): Task {
  const task: Task = {
    id: `t${nextTaskId++}`,
    title: input.title,
    sessions: 0,
    done: false,
  }
  tasks.push(task)
  return task
}

export function findTask(id: string): Task | undefined {
  return tasks.find((t) => t.id === id)
}

export function updateTask(
  id: string,
  patch: { done?: boolean; session?: boolean },
): Task | undefined {
  const task = tasks.find((t) => t.id === id)
  if (!task) return undefined
  if (patch.session === true) task.sessions += 1
  if (typeof patch.done === 'boolean') task.done = patch.done
  return task
}

export function toggleTaskDone(id: string): Task | undefined {
  const task = tasks.find((t) => t.id === id)
  if (!task) return undefined
  task.done = !task.done
  return task
}

export function deleteTask(id: string): boolean {
  const idx = tasks.findIndex((t) => t.id === id)
  if (idx === -1) return false
  tasks.splice(idx, 1)
  return true
}
