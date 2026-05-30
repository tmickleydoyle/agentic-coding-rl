'use client'
import { useApp } from '../components/AppStateProvider'
import type { Project, Task } from '../lib/types'

export type TaskCounts = {
  total: number
  completed: number
  active: number
  byProject: Record<string, number>
}

export function countTasks(_tasks: Task[], _projects: Project[]): TaskCounts {
  // TODO: compute total/completed/active and per-project counts
  return { total: 0, completed: 0, active: 0, byProject: {} }
}

export function filterTasks(
  _tasks: Task[],
  _statusFilter: 'all' | 'active' | 'done',
  _projectFilter: string,
): Task[] {
  // TODO: apply status + project filters
  return []
}

export function useTasks() {
  const { tasks, projects, statusFilter, projectFilter } = useApp()
  const counts = countTasks(tasks, projects)
  const filtered = filterTasks(tasks, statusFilter, projectFilter)
  return { counts, filtered }
}
