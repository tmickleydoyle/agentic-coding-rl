import type { Activity, Trip } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level trips/activities + id counters; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listTrips(): Trip[] {
  // TODO: return all trips
  return []
}

export function findTrip(_id: string): Trip | undefined {
  // TODO: look up a trip by id
  return undefined
}

export function createTrip(_input: { name: string; destination?: string; days?: number }): Trip {
  // TODO: append a new trip with a fresh id and return it
  return { id: '', name: '', destination: '', days: 1 }
}

export function listActivities(_filter?: { tripId?: string | null }): Activity[] {
  // TODO: return activities, optionally filtered by tripId
  return []
}

export function findActivity(_id: string): Activity | undefined {
  // TODO: look up an activity by id
  return undefined
}

export function createActivity(_input: {
  tripId: string
  day: number
  title: string
  cost?: number
}): Activity {
  // TODO: append a new activity with a fresh id and return it
  return { id: '', tripId: '', day: 1, title: '', cost: 0 }
}

export function deleteActivity(_id: string): boolean {
  // TODO: remove the activity; return whether it existed
  return false
}

export function tripCost(_tripId: string): number {
  // TODO: sum the cost of all activities for the trip
  return 0
}
