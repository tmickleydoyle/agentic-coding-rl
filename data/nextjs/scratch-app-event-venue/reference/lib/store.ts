import type { Booking, Venue } from './types'

// In-memory server store for the API routes. Separate from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let venues: Venue[] = []
let bookings: Booking[] = []
let nextId = 3

function seed(): void {
  venues = [
    { id: 'g1', name: 'Grand Hall', capacity: 200 },
    { id: 'g2', name: 'Studio B', capacity: 40 },
  ]
  bookings = [
    { id: 'b1', venueId: 'g1', date: '2026-06-01', attendees: 150, organizer: 'Ada' },
    { id: 'b2', venueId: 'g2', date: '2026-06-02', attendees: 30, organizer: 'Grace' },
  ]
  nextId = 3
}

seed()

export function __reset(): void {
  seed()
}

export function listVenues(): Venue[] {
  return venues.slice()
}

export function findVenue(id: string): Venue | undefined {
  return venues.find((v) => v.id === id)
}

export function listBookings(filter?: {
  venueId?: string | null
  date?: string | null
}): Booking[] {
  let out = bookings.slice()
  const venueId = filter?.venueId
  if (venueId) out = out.filter((b) => b.venueId === venueId)
  const date = filter?.date
  if (date) out = out.filter((b) => b.date === date)
  return out
}

export function isBooked(venueId: string, date: string): boolean {
  return bookings.some((b) => b.venueId === venueId && b.date === date)
}

export function createBooking(input: {
  venueId: string
  date: string
  attendees: number
  organizer: string
}): Booking {
  const booking: Booking = {
    id: `b${nextId++}`,
    venueId: input.venueId,
    date: input.date,
    attendees: input.attendees,
    organizer: input.organizer,
  }
  bookings.push(booking)
  return booking
}

export function deleteBooking(id: string): boolean {
  const idx = bookings.findIndex((b) => b.id === id)
  if (idx === -1) return false
  bookings.splice(idx, 1)
  return true
}
