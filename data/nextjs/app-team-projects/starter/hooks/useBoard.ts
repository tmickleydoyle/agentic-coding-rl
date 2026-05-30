'use client'
import { useApp } from '../components/AppStateProvider'
import type { Member, Task } from '../lib/types'

export function countWorkload(_tasks: Task[], _members: Member[]): Record<string, number> {
  // TODO: count tasks per assignee id, plus an 'unassigned' bucket
  return {}
}

export function tasksForProject(_tasks: Task[], _projectId: string): Task[] {
  // TODO: filter tasks by projectId
  return []
}

export function tasksByStatus(_tasks: Task[]): { todo: Task[]; doing: Task[]; done: Task[] } {
  // TODO: split tasks into todo/doing/done buckets
  return { todo: [], doing: [], done: [] }
}

export function useBoard() {
  const { tasks, members } = useApp()
  const workload = countWorkload(tasks, members)
  const byStatus = tasksByStatus(tasks)
  return { workload, byStatus }
}
