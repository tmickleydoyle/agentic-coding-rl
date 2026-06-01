import type { Member, Project, Task, TaskStatus } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let members: Member[] = []
let projects: Project[] = []
let tasks: Task[] = []
let nextTaskId = 1
let nextProjectId = 1

function seed(): void {
  members = [
    { id: 'm1', name: 'Ada' },
    { id: 'm2', name: 'Grace' },
    { id: 'm3', name: 'Linus' },
  ]
  projects = [
    { id: 'p1', name: 'Website' },
    { id: 'p2', name: 'Mobile' },
    { id: 'p3', name: 'Platform' },
  ]
  tasks = [
    { id: 'k1', title: 'Design home', projectId: 'p1', assigneeId: 'm1', status: 'doing' },
    { id: 'k2', title: 'Ship login', projectId: 'p1', assigneeId: 'm2', status: 'todo' },
    { id: 'k3', title: 'API gateway', projectId: 'p3', assigneeId: 'm1', status: 'done' },
  ]
  nextTaskId = 4
  nextProjectId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listMembers(): Member[] {
  return members.slice()
}

export function listTasks(filter?: { projectId?: string | null; assigneeId?: string | null }): Task[] {
  let out = tasks.slice()
  const projectId = filter?.projectId
  if (projectId) out = out.filter((t) => t.projectId === projectId)
  const assigneeId = filter?.assigneeId
  if (assigneeId === 'unassigned') out = out.filter((t) => t.assigneeId === null)
  else if (assigneeId) out = out.filter((t) => t.assigneeId === assigneeId)
  return out
}

export function createTask(input: {
  title: string
  projectId?: string
  assigneeId?: string | null
}): Task {
  const task: Task = {
    id: `k${nextTaskId++}`,
    title: input.title,
    projectId: input.projectId ?? 'p1',
    assigneeId: input.assigneeId ?? null,
    status: 'todo',
  }
  tasks.push(task)
  return task
}

export function findTask(id: string): Task | undefined {
  return tasks.find((t) => t.id === id)
}

export function updateTask(
  id: string,
  patch: { assigneeId?: string | null; status?: TaskStatus; title?: string },
): Task | undefined {
  const task = tasks.find((t) => t.id === id)
  if (!task) return undefined
  if (patch.assigneeId !== undefined) task.assigneeId = patch.assigneeId
  if (patch.status !== undefined) task.status = patch.status
  if (typeof patch.title === 'string') task.title = patch.title
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

export function projectsWithCounts(): Array<Project & { taskCount: number }> {
  return projects.map((p) => ({
    ...p,
    taskCount: tasks.filter((t) => t.projectId === p.id).length,
  }))
}

export function createProject(input: { name: string }): Project {
  const project: Project = { id: `p${nextProjectId++}`, name: input.name }
  projects.push(project)
  return project
}
