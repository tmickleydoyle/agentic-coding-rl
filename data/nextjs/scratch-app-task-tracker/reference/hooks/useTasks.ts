'use client'
import { useApp } from '../components/AppStateProvider'
import type { Project, Task } from '../lib/types'

export type TaskCounts = {
  total: number
  completed: number
  active: number
  byProject: Record<string, number>
}

export function countTasks(tasks: Task[], projects: Project[]): TaskCounts {
  const byProject: Record<string, number> = {}
  projects.forEach((p) => {
    byProject[p.id] = 0
  })
  let completed = 0
  tasks.forEach((t) => {
    if (t.done) completed += 1
    byProject[t.projectId] = (byProject[t.projectId] ?? 0) + 1
  })
  return {
    total: tasks.length,
    completed,
    active: tasks.length - completed,
    byProject,
  }
}

export function filterTasks(
  tasks: Task[],
  statusFilter: 'all' | 'active' | 'done',
  projectFilter: string,
): Task[] {
  return tasks.filter((t) => {
    if (statusFilter === 'active' && t.done) return false
    if (statusFilter === 'done' && !t.done) return false
    if (projectFilter !== 'all' && t.projectId !== projectFilter) return false
    return true
  })
}

export function useTasks() {
  const { tasks, projects, statusFilter, projectFilter } = useApp()
  const counts = countTasks(tasks, projects)
  const filtered = filterTasks(tasks, statusFilter, projectFilter)
  return { counts, filtered }
}
