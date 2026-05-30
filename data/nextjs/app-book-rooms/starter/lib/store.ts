import type { Booking, Room } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `rooms`, `bookings`, and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listRooms(): Room[] {
  // TODO: return all rooms
  return []
}

export function listBookings(_filter?: { roomId?: string | null }): Booking[] {
  // TODO: return bookings, applying optional roomId filter
  return []
}

export function hasConflict(_roomId: string, _start: number, _end: number, _ignoreId?: string): boolean {
  // TODO: report whether [start,end) overlaps an existing booking on the room
  return false
}

export function createBooking(_input: {
  roomId: string
  start: number
  end: number
  title: string
}): Booking {
  // TODO: append a new booking with a fresh id and return it
  return { id: '', roomId: '', start: 0, end: 0, title: '' }
}

export function deleteBooking(_id: string): boolean {
  // TODO: remove the booking; return whether it existed
  return false
}
