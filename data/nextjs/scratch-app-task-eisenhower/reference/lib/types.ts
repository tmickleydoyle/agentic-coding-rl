export type Quadrant = 'do' | 'schedule' | 'delegate' | 'delete'

export type Task = {
  id: string
  title: string
  urgent: boolean
  important: boolean
}

export type Route = 'matrix' | 'add' | 'focus-list' | 'settings'
export type Theme = 'light' | 'dark'

export const QUADRANTS: Quadrant[] = ['do', 'schedule', 'delegate', 'delete']

export function quadrantOf(task: { urgent: boolean; important: boolean }): Quadrant {
  if (task.urgent && task.important) return 'do'
  if (!task.urgent && task.important) return 'schedule'
  if (task.urgent && !task.important) return 'delegate'
  return 'delete'
}

export function quadrantFlags(q: Quadrant): { urgent: boolean; important: boolean } {
  switch (q) {
    case 'do':
      return { urgent: true, important: true }
    case 'schedule':
      return { urgent: false, important: true }
    case 'delegate':
      return { urgent: true, important: false }
    case 'delete':
    default:
      return { urgent: false, important: false }
  }
}

export function isQuadrant(value: unknown): value is Quadrant {
  return (
    value === 'do' || value === 'schedule' || value === 'delegate' || value === 'delete'
  )
}
