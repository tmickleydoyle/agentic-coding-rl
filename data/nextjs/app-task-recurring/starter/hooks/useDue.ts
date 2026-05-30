'use client'
import { useRecurring } from '../components/RecurringProvider'
import type { Task } from '../lib/types'

export function filterDue(_tasks: Task[], _today: string): Task[] {
  // TODO: return tasks whose nextDue <= today
  return []
}

export function useDue() {
  const { tasks, today } = useRecurring()
  const dueToday = filterDue(tasks, today)
  const counts = {
    total: tasks.length,
    dueToday: dueToday.length,
    scheduled: tasks.length - dueToday.length,
  }
  return { dueToday, counts }
}
