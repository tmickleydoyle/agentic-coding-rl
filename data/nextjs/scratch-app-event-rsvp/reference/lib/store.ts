import type { EventItem, Invite, Rsvp } from './types'
import { RSVP_VALUES } from './types'

// In-memory server store for the API routes. Separate from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let events: EventItem[] = []
let nextId = 3

function seed(): void {
  events = [
    {
      id: 'e1',
      name: 'Launch Party',
      date: '2026-09-10',
      invites: [
        { id: 'i1', guest: 'Ada', status: 'yes', extraGuests: 2 },
        { id: 'i2', guest: 'Grace', status: 'maybe', extraGuests: 0 },
        { id: 'i3', guest: 'Linus', status: 'pending', extraGuests: 0 },
      ],
    },
    {
      id: 'e2',
      name: 'Team Offsite',
      date: '2026-10-01',
      invites: [{ id: 'i4', guest: 'Edsger', status: 'no', extraGuests: 0 }],
    },
  ]
  nextId = 3
}

seed()

export function __reset(): void {
  seed()
}

export function listEvents(id?: string | null): EventItem[] {
  if (id) return events.filter((e) => e.id === id)
  return events.slice()
}

export function findEvent(id: string): EventItem | undefined {
  return events.find((e) => e.id === id)
}

export function isValidRsvp(status: string): status is Rsvp {
  return RSVP_VALUES.indexOf(status as Rsvp) !== -1
}

export function createEvent(input: { name: string; date: string }): EventItem {
  const event: EventItem = {
    id: `e${nextId++}`,
    name: input.name,
    date: input.date,
    invites: [],
  }
  events.push(event)
  return event
}

export function updateInvite(
  eventId: string,
  inviteId: string,
  status: Rsvp,
  extraGuests: number,
): Invite | undefined {
  const event = findEvent(eventId)
  if (!event) return undefined
  const invite = event.invites.find((i) => i.id === inviteId)
  if (!invite) return undefined
  invite.status = status
  invite.extraGuests = extraGuests
  return invite
}

export function deleteEvent(id: string): boolean {
  const idx = events.findIndex((e) => e.id === id)
  if (idx === -1) return false
  events.splice(idx, 1)
  return true
}
