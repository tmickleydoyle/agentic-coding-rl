'use client'
import { useApp } from '../components/AppStateProvider'
import type { Member, Task } from '../lib/types'

export function countWorkload(tasks: Task[], members: Member[]): Record<string, number> {
  const load: Record<string, number> = { unassigned: 0 }
  members.forEach((m) => {
    load[m.id] = 0
  })
  tasks.forEach((t) => {
    const key = t.assigneeId ?? 'unassigned'
    load[key] = (load[key] ?? 0) + 1
  })
  return load
}

export function tasksForProject(tasks: Task[], projectId: string): Task[] {
  return tasks.filter((t) => t.projectId === projectId)
}

export function tasksByStatus(tasks: Task[]): { todo: Task[]; doing: Task[]; done: Task[] } {
  return {
    todo: tasks.filter((t) => t.status === 'todo'),
    doing: tasks.filter((t) => t.status === 'doing'),
    done: tasks.filter((t) => t.status === 'done'),
  }
}

export function useBoard() {
  const { tasks, members } = useApp()
  const workload = countWorkload(tasks, members)
  const byStatus = tasksByStatus(tasks)
  return { workload, byStatus }
}
