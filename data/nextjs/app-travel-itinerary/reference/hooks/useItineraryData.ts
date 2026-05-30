'use client'
import { useItinerary } from '../components/ItineraryProvider'
import type { Activity } from '../lib/types'

export function tripTotal(activities: Activity[], tripId: string): number {
  return activities
    .filter((a) => a.tripId === tripId)
    .reduce((sum, a) => sum + a.cost, 0)
}

export function activitiesForDay(
  activities: Activity[],
  tripId: string,
  day: number,
): Activity[] {
  return activities.filter((a) => a.tripId === tripId && a.day === day)
}

export type DayGroup = { day: number; activities: Activity[]; cost: number }

export function groupByDay(activities: Activity[], tripId: string, days: number): DayGroup[] {
  const groups: DayGroup[] = []
  for (let d = 1; d <= days; d += 1) {
    const dayActs = activitiesForDay(activities, tripId, d)
    const cost = dayActs.reduce((sum, a) => sum + a.cost, 0)
    groups.push({ day: d, activities: dayActs, cost })
  }
  return groups
}

export function useTripDetail(tripId: string | null) {
  const { trips, activities } = useItinerary()
  const trip = tripId ? trips.find((t) => t.id === tripId) ?? null : null
  const groups = trip ? groupByDay(activities, trip.id, trip.days) : []
  const total = trip ? tripTotal(activities, trip.id) : 0
  return { trip, groups, total }
}
