import type { Member, Project, Task, TaskStatus } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level members/projects/tasks and id counters; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listMembers(): Member[] {
  // TODO: return all members
  return []
}

export function listTasks(_filter?: { projectId?: string | null; assigneeId?: string | null }): Task[] {
  // TODO: return tasks, applying optional projectId + assigneeId filters
  return []
}

export function createTask(_input: {
  title: string
  projectId?: string
  assigneeId?: string | null
}): Task {
  // TODO: append a new task (status 'todo') with a fresh id and return it
  return { id: '', title: '', projectId: '', assigneeId: null, status: 'todo' }
}

export function findTask(_id: string): Task | undefined {
  // TODO: look up a task by id
  return undefined
}

export function updateTask(
  _id: string,
  _patch: { assigneeId?: string | null; status?: TaskStatus; title?: string },
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

export function projectsWithCounts(): Array<Project & { taskCount: number }> {
  // TODO: return projects each with a taskCount of their tasks
  return []
}

export function createProject(_input: { name: string }): Project {
  // TODO: append a new project with a fresh id and return it
  return { id: '', name: '' }
}
