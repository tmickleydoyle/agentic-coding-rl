import type { Hire, OnboardTask } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider.
// Tests call __reset() in beforeEach so each test starts from the same seed.

let hires: Hire[] = []
let tasks: OnboardTask[] = []
let nextHireId = 1
let nextTaskId = 1

function seed(): void {
  hires = [
    { id: 'h1', name: 'Ada', role: 'Engineer', startDate: '2026-06-01' },
    { id: 'h2', name: 'Grace', role: 'Designer', startDate: '2026-06-15' },
    { id: 'h3', name: 'Linus', role: 'Manager', startDate: '2026-07-01' },
  ]
  tasks = [
    { id: 't1', hireId: 'h1', label: 'Sign contract', done: true },
    { id: 't2', hireId: 'h1', label: 'Setup laptop', done: true },
    { id: 't3', hireId: 'h1', label: 'Meet team', done: false },
    { id: 't4', hireId: 'h1', label: 'Read handbook', done: false },
    { id: 't5', hireId: 'h2', label: 'Sign contract', done: true },
    { id: 't6', hireId: 'h2', label: 'Setup laptop', done: false },
  ]
  nextHireId = 4
  nextTaskId = 7
}

seed()

export function __reset(): void {
  seed()
}

export function listHires(): Hire[] {
  return hires.slice()
}

export function findHire(id: string): Hire | undefined {
  return hires.find((h) => h.id === id)
}

export function tasksForHire(hireId: string): OnboardTask[] {
  return tasks.filter((t) => t.hireId === hireId)
}

export function hireProgress(hireId: string): number {
  const own = tasks.filter((t) => t.hireId === hireId)
  if (own.length === 0) return 0
  const done = own.filter((t) => t.done).length
  return Math.round((done / own.length) * 100)
}

export function hiresWithProgress(): Array<Hire & { total: number; done: number; percent: number }> {
  return hires.map((h) => {
    const own = tasks.filter((t) => t.hireId === h.id)
    const done = own.filter((t) => t.done).length
    const percent = own.length === 0 ? 0 : Math.round((done / own.length) * 100)
    return { ...h, total: own.length, done, percent }
  })
}

export function createHire(input: { name: string; role?: string; startDate?: string }): Hire {
  const hire: Hire = {
    id: `h${nextHireId++}`,
    name: input.name,
    role: input.role ?? 'New Hire',
    startDate: input.startDate ?? '',
  }
  hires.push(hire)
  return hire
}

export function listTasks(filter?: { hireId?: string | null }): OnboardTask[] {
  let out = tasks.slice()
  const hireId = filter?.hireId
  if (hireId) out = out.filter((t) => t.hireId === hireId)
  return out
}

export function findTask(id: string): OnboardTask | undefined {
  return tasks.find((t) => t.id === id)
}

export function createTask(input: { hireId: string; label: string }): OnboardTask {
  const task: OnboardTask = {
    id: `t${nextTaskId++}`,
    hireId: input.hireId,
    label: input.label,
    done: false,
  }
  tasks.push(task)
  return task
}

export function setTaskDone(id: string, done: boolean): OnboardTask | undefined {
  const task = tasks.find((t) => t.id === id)
  if (!task) return undefined
  task.done = done
  return task
}
