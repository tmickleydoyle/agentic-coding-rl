export type Schedule = 'daily' | 'weekly'

export type Task = {
  id: string
  title: string
  schedule: Schedule
  nextDue: string
}

export type HistoryEntry = {
  id: string
  taskId: string
  title: string
  completedOn: string
}

export type Route = 'today' | 'all-tasks' | 'add' | 'history'
export type Theme = 'light' | 'dark'

export const TODAY = '2026-05-29'

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map((p) => Number(p))
  const base = Date.UTC(y, m - 1, d)
  const next = new Date(base + days * 24 * 60 * 60 * 1000)
  const yy = next.getUTCFullYear()
  const mm = String(next.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(next.getUTCDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

export function nextDueDate(from: string, schedule: Schedule): string {
  return addDays(from, schedule === 'weekly' ? 7 : 1)
}

export function isSchedule(value: unknown): value is Schedule {
  return value === 'daily' || value === 'weekly'
}
