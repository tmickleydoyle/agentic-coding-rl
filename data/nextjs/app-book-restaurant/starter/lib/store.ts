import type { Reservation, Table } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `tables`, `reservations`, and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listTables(): Table[] {
  // TODO: return all tables
  return []
}

export function findTable(_id: string): Table | undefined {
  // TODO: look up a table by id
  return undefined
}

export function listReservations(_filter?: { tableId?: string | null; time?: string | null }): Reservation[] {
  // TODO: return reservations, applying optional tableId + time filters
  return []
}

export function isReserved(_tableId: string, _time: string): boolean {
  // TODO: report whether a table is already reserved at a time
  return false
}

export function createReservation(_input: {
  tableId: string
  time: string
  party: number
  name: string
}): Reservation {
  // TODO: append a new reservation with a fresh id and return it
  return { id: '', tableId: '', time: '', party: 0, name: '' }
}

export function deleteReservation(_id: string): boolean {
  // TODO: remove the reservation; return whether it existed
  return false
}
