export type Venue = {
  id: string
  name: string
  capacity: number
}

export type Booking = {
  id: string
  venueId: string
  date: string
  attendees: number
  organizer: string
}

export type Route = 'venues' | 'venue-detail' | 'book' | 'bookings'
export type Theme = 'light' | 'dark'

export const DATES: string[] = ['2026-06-01', '2026-06-02', '2026-06-03']
