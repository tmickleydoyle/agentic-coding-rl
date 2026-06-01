import type { Card, Grade } from './types'
import { TODAY } from './types'

// Pure scheduling logic shared by client + server.
export function reschedule(card: Card, grade: Grade): Card {
  if (grade === 'hard') {
    return { ...card, interval: 1, dueDay: TODAY + 1 }
  }
  const interval = Math.max(1, card.interval) * 2
  return { ...card, interval, dueDay: TODAY + interval }
}

export function isDue(card: Card): boolean {
  return card.dueDay <= TODAY
}
