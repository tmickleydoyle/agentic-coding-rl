'use client'
import { useItinerary } from '../components/ItineraryProvider'
import type { Activity, Trip } from '../lib/types'

export function tripTotal(_activities: Activity[], _tripId: string): number {
  // TODO: sum the cost of all activities for the trip
  return 0
}

export function activitiesForDay(
  _activities: Activity[],
  _tripId: string,
  _day: number,
): Activity[] {
  // TODO: filter to one trip + day
  return []
}

export type DayGroup = { day: number; activities: Activity[]; cost: number }

export function groupByDay(_activities: Activity[], _tripId: string, _days: number): DayGroup[] {
  // TODO: build a group per day 1..days
  return []
}

export function useTripDetail(tripId: string | null) {
  const { trips } = useItinerary()
  const trip: Trip | null = tripId ? trips.find((t) => t.id === tripId) ?? null : null
  // TODO: compute groups + total
  return { trip, groups: [] as DayGroup[], total: 0 }
}
