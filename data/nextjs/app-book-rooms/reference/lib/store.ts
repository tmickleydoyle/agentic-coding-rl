import type { Booking, Room } from './types'
import { overlaps } from './types'

// In-memory server store for the API routes. Separate from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let rooms: Room[] = []
let bookings: Booking[] = []
let nextId = 1

function seed(): void {
  rooms = [
    { id: 'm1', name: 'Aspen', floor: 1 },
    { id: 'm2', name: 'Birch', floor: 2 },
    { id: 'm3', name: 'Cedar', floor: 3 },
  ]
  bookings = [
    { id: 'k1', roomId: 'm1', start: 9, end: 10, title: 'Standup' },
    { id: 'k2', roomId: 'm2', start: 13, end: 14, title: 'Review' },
  ]
  nextId = 3
}

seed()

export function __reset(): void {
  seed()
}

export function listRooms(): Room[] {
  return rooms.slice()
}

export function listBookings(filter?: { roomId?: string | null }): Booking[] {
  let out = bookings.slice()
  const roomId = filter?.roomId
  if (roomId) out = out.filter((b) => b.roomId === roomId)
  return out
}

export function hasConflict(roomId: string, start: number, end: number, ignoreId?: string): boolean {
  return bookings.some(
    (b) => b.roomId === roomId && b.id !== ignoreId && overlaps(b.start, b.end, start, end),
  )
}

export function createBooking(input: {
  roomId: string
  start: number
  end: number
  title: string
}): Booking {
  const booking: Booking = {
    id: `k${nextId++}`,
    roomId: input.roomId,
    start: input.start,
    end: input.end,
    title: input.title,
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
