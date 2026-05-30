import type { Booking, Service } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `services`, `bookings`, and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listServices(): Service[] {
  // TODO: return all services
  return []
}

export function listBookings(_filter?: { serviceId?: string | null; slot?: string | null }): Booking[] {
  // TODO: return bookings, applying optional serviceId + slot filters
  return []
}

export function isSlotTaken(_serviceId: string, _slot: string): boolean {
  // TODO: report whether a slot is already booked for a service
  return false
}

export function createBooking(_input: { serviceId: string; slot: string; customer: string }): Booking {
  // TODO: append a new booking with a fresh id and return it
  return { id: '', serviceId: '', slot: '', customer: '' }
}

export function deleteBooking(_id: string): boolean {
  // TODO: remove the booking; return whether it existed
  return false
}
