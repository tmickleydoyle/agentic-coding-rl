import type { HistoryEntry, Schedule, Task } from './types'
import { nextDueDate, TODAY } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// RecurringProvider state. Tests call __reset() in beforeEach so each test starts from
// the same seed.

let tasks: Task[] = []
let history: HistoryEntry[] = []
let nextTaskId = 1
let nextHistoryId = 1

function seed(): void {
  tasks = [
    { id: 't1', title: 'Water plants', schedule: 'daily', nextDue: '2026-05-29' },
    { id: 't2', title: 'Take meds', schedule: 'daily', nextDue: '2026-05-28' },
    { id: 't3', title: 'Team sync', schedule: 'weekly', nextDue: '2026-06-02' },
  ]
  history = [
    { id: 'h1', taskId: 't1', title: 'Water plants', completedOn: '2026-05-28' },
  ]
  nextTaskId = 4
  nextHistoryId = 2
}

seed()

export function __reset(): void {
  seed()
}

export function listTasks(filter?: { due?: string | null; schedule?: string | null }): Task[] {
  let out = tasks.slice()
  if (filter?.due === 'true') out = out.filter((t) => t.nextDue <= TODAY)
  const schedule = filter?.schedule
  if (schedule) out = out.filter((t) => t.schedule === schedule)
  return out
}

export function createTask(input: { title: string; schedule: Schedule }): Task {
  const task: Task = {
    id: `t${nextTaskId++}`,
    title: input.title,
    schedule: input.schedule,
    nextDue: TODAY,
  }
  tasks.push(task)
  return task
}

export function findTask(id: string): Task | undefined {
  return tasks.find((t) => t.id === id)
}

export function completeTask(id: string): Task | undefined {
  const task = tasks.find((t) => t.id === id)
  if (!task) return undefined
  history.push({
    id: `h${nextHistoryId++}`,
    taskId: task.id,
    title: task.title,
    completedOn: TODAY,
  })
  task.nextDue = nextDueDate(TODAY, task.schedule)
  return task
}

export function deleteTask(id: string): boolean {
  const idx = tasks.findIndex((t) => t.id === id)
  if (idx === -1) return false
  tasks.splice(idx, 1)
  return true
}

export function listHistory(): HistoryEntry[] {
  return history.slice()
}
