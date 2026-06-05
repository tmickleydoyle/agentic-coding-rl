import type { Project, Task } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let tasks: Task[] = []
let projects: Project[] = []
let nextTaskId = 1
let nextProjectId = 1

function seed(): void {
  projects = [
    { id: 'p1', name: 'Inbox' },
    { id: 'p2', name: 'Work' },
    { id: 'p3', name: 'Home' },
  ]
  tasks = [
    { id: 't1', title: 'Write spec', projectId: 'p2', done: false, dueDate: '2026-06-01' },
    { id: 't2', title: 'Buy groceries', projectId: 'p3', done: true, dueDate: null },
    { id: 't3', title: 'Triage inbox', projectId: 'p1', done: false, dueDate: null },
  ]
  nextTaskId = 4
  nextProjectId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listTasks(filter?: { status?: string | null; projectId?: string | null }): Task[] {
  let out = tasks.slice()
  const status = filter?.status
  if (status === 'active') out = out.filter((t) => !t.done)
  else if (status === 'done') out = out.filter((t) => t.done)
  const projectId = filter?.projectId
  if (projectId) out = out.filter((t) => t.projectId === projectId)
  return out
}

export function createTask(input: { title: string; projectId?: string; dueDate?: string | null }): Task {
  const task: Task = {
    id: `t${nextTaskId++}`,
    title: input.title,
    projectId: input.projectId ?? 'p1',
    done: false,
    dueDate: input.dueDate ?? null,
  }
  tasks.push(task)
  return task
}

export function findTask(id: string): Task | undefined {
  return tasks.find((t) => t.id === id)
}

export function updateTask(
  id: string,
  patch: { done?: boolean; title?: string; projectId?: string; dueDate?: string | null },
): Task | undefined {
  const task = tasks.find((t) => t.id === id)
  if (!task) return undefined
  if (typeof patch.done === 'boolean') task.done = patch.done
  if (typeof patch.title === 'string') task.title = patch.title
  if (typeof patch.projectId === 'string') task.projectId = patch.projectId
  if (patch.dueDate !== undefined) task.dueDate = patch.dueDate
  return task
}

export function deleteTask(id: string): boolean {
  const idx = tasks.findIndex((t) => t.id === id)
  if (idx === -1) return false
  tasks.splice(idx, 1)
  return true
}

export function listProjects(): Project[] {
  return projects.slice()
}

export function createProject(input: { name: string }): Project {
  const project: Project = { id: `p${nextProjectId++}`, name: input.name }
  projects.push(project)
  return project
}
