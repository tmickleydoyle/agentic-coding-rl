import type { Activity, Trip } from './types'

// In-memory server store for the API routes. SEPARATE from the client provider state.
// Tests call __reset() in beforeEach so each test starts from the same seed.

let trips: Trip[] = []
let activities: Activity[] = []
let nextTripId = 1
let nextActivityId = 1

function seed(): void {
  trips = [
    { id: 'tr1', name: 'Japan Spring', destination: 'Tokyo', days: 3 },
    { id: 'tr2', name: 'Italy Tour', destination: 'Rome', days: 2 },
  ]
  activities = [
    { id: 'a1', tripId: 'tr1', day: 1, title: 'Shibuya walk', cost: 0 },
    { id: 'a2', tripId: 'tr1', day: 1, title: 'Sushi dinner', cost: 60 },
    { id: 'a3', tripId: 'tr1', day: 2, title: 'Mt Fuji tour', cost: 120 },
    { id: 'a4', tripId: 'tr2', day: 1, title: 'Colosseum', cost: 25 },
  ]
  nextTripId = 3
  nextActivityId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listTrips(): Trip[] {
  return trips.slice()
}

export function findTrip(id: string): Trip | undefined {
  return trips.find((t) => t.id === id)
}

export function createTrip(input: { name: string; destination?: string; days?: number }): Trip {
  const trip: Trip = {
    id: `tr${nextTripId++}`,
    name: input.name,
    destination: input.destination ?? '',
    days: typeof input.days === 'number' && input.days > 0 ? input.days : 1,
  }
  trips.push(trip)
  return trip
}

export function listActivities(filter?: { tripId?: string | null }): Activity[] {
  let out = activities.slice()
  const tripId = filter?.tripId
  if (tripId) out = out.filter((a) => a.tripId === tripId)
  return out
}

export function findActivity(id: string): Activity | undefined {
  return activities.find((a) => a.id === id)
}

export function createActivity(input: {
  tripId: string
  day: number
  title: string
  cost?: number
}): Activity {
  const activity: Activity = {
    id: `a${nextActivityId++}`,
    tripId: input.tripId,
    day: input.day,
    title: input.title,
    cost: input.cost ?? 0,
  }
  activities.push(activity)
  return activity
}

export function deleteActivity(id: string): boolean {
  const idx = activities.findIndex((a) => a.id === id)
  if (idx === -1) return false
  activities.splice(idx, 1)
  return true
}

export function tripCost(tripId: string): number {
  return activities
    .filter((a) => a.tripId === tripId)
    .reduce((sum, a) => sum + a.cost, 0)
}
