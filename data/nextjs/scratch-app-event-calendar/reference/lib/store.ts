import type { EventItem } from './types'
import { DAYS_IN_MONTH } from './types'

// In-memory server store for the API routes. Separate from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let events: EventItem[] = []
let nextId = 4

function seed(): void {
  events = [
    { id: 'v1', title: 'Standup', day: 2, category: 'work' },
    { id: 'v2', title: 'Lunch', day: 2, category: 'social' },
    { id: 'v3', title: 'Gym', day: 15, category: 'personal' },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listEvents(filter?: {
  category?: string | null
  day?: string | null
}): EventItem[] {
  let out = events.slice()
  const category = filter?.category
  if (category) out = out.filter((e) => e.category === category)
  const day = filter?.day
  if (day) {
    const n = Number(day)
    out = out.filter((e) => e.day === n)
  }
  return out
}

export function isValidDay(day: number): boolean {
  return Number.isInteger(day) && day >= 1 && day <= DAYS_IN_MONTH
}

export function createEvent(input: {
  title: string
  day: number
  category: string
}): EventItem {
  const event: EventItem = {
    id: `v${nextId++}`,
    title: input.title,
    day: input.day,
    category: input.category,
  }
  events.push(event)
  return event
}

export function deleteEvent(id: string): boolean {
  const idx = events.findIndex((e) => e.id === id)
  if (idx === -1) return false
  events.splice(idx, 1)
  return true
}
