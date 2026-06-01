'use client'
import { useApp } from '../components/AppStateProvider'
import type { Booking, Venue } from '../lib/types'

export function venueIsBooked(
  bookings: Booking[],
  venueId: string,
  date: string,
): boolean {
  return bookings.some((b) => b.venueId === venueId && b.date === date)
}

export function findAvailable(
  venues: Venue[],
  bookings: Booking[],
  date: string,
): Venue[] {
  return venues.filter((v) => !venueIsBooked(bookings, v.id, date))
}

export function useAvailability() {
  const { venues, bookings } = useApp()

  const availableVenues = (date: string): Venue[] =>
    findAvailable(venues, bookings, date)

  const bookingCount = (venueId: string): number =>
    bookings.filter((b) => b.venueId === venueId).length

  let totalAttendees = 0
  bookings.forEach((b) => {
    totalAttendees += b.attendees
  })

  return { availableVenues, bookingCount, totalAttendees }
}
