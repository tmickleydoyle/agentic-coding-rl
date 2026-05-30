import type { Appointment, Provider } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `providers`, `appointments`, and an id counter; seed them;
// provide __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listProviders(): Provider[] {
  // TODO: return all providers
  return []
}

export function findProvider(_id: string): Provider | undefined {
  // TODO: look up a provider by id
  return undefined
}

export function listAppointments(_filter?: {
  providerId?: string | null
  when?: string | null
}): Appointment[] {
  // TODO: return appointments, applying optional providerId + when (upcoming/past) filters
  return []
}

export function isSlotTaken(_providerId: string, _date: string): boolean {
  // TODO: report whether a provider's slot/date is already booked
  return false
}

export function createAppointment(_input: {
  providerId: string
  date: string
  patient: string
}): Appointment {
  // TODO: append a new appointment with a fresh id and return it
  return { id: '', providerId: '', date: '', patient: '' }
}

export function deleteAppointment(_id: string): boolean {
  // TODO: remove the appointment; return whether it existed
  return false
}
