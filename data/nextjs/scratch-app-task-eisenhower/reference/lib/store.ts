import type { Quadrant, Task } from './types'
import { quadrantFlags, quadrantOf } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// MatrixProvider state. Tests call __reset() in beforeEach so each test starts from the
// same seed.

let tasks: Task[] = []
let nextTaskId = 1

function seed(): void {
  tasks = [
    { id: 't1', title: 'Fix outage', urgent: true, important: true },
    { id: 't2', title: 'Plan roadmap', urgent: false, important: true },
    { id: 't3', title: 'Answer emails', urgent: true, important: false },
    { id: 't4', title: 'Browse forums', urgent: false, important: false },
  ]
  nextTaskId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listTasks(filter?: { quadrant?: Quadrant | null }): Task[] {
  let out = tasks.slice()
  const quadrant = filter?.quadrant
  if (quadrant) out = out.filter((t) => quadrantOf(t) === quadrant)
  return out
}

export function createTask(input: {
  title: string
  urgent?: boolean
  important?: boolean
}): Task {
  const task: Task = {
    id: `t${nextTaskId++}`,
    title: input.title,
    urgent: input.urgent ?? false,
    important: input.important ?? false,
  }
  tasks.push(task)
  return task
}

export function findTask(id: string): Task | undefined {
  return tasks.find((t) => t.id === id)
}

export function updateTask(
  id: string,
  patch: { quadrant?: Quadrant; urgent?: boolean; important?: boolean },
): Task | undefined {
  const task = tasks.find((t) => t.id === id)
  if (!task) return undefined
  if (patch.quadrant !== undefined) {
    const flags = quadrantFlags(patch.quadrant)
    task.urgent = flags.urgent
    task.important = flags.important
  }
  if (typeof patch.urgent === 'boolean') task.urgent = patch.urgent
  if (typeof patch.important === 'boolean') task.important = patch.important
  return task
}

export function deleteTask(id: string): boolean {
  const idx = tasks.findIndex((t) => t.id === id)
  if (idx === -1) return false
  tasks.splice(idx, 1)
  return true
}
