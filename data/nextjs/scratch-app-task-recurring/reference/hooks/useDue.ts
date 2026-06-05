'use client'
import { useRecurring } from '../components/RecurringProvider'
import type { Task } from '../lib/types'

export function filterDue(tasks: Task[], today: string): Task[] {
  return tasks.filter((t) => t.nextDue <= today)
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
