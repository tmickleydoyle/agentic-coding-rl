export interface Event {
  id: string
  name: string
  date: string
  venue: string
  capacity: number
  status: 'upcoming' | 'completed' | 'cancelled'
}

export interface Attendee {
  id: string
  name: string
  email: string
  eventId: string
  registrationDate: string
}

export interface Session {
  id: string
  title: string
  eventId: string
  startTime: string
  endTime: string
  speaker: string
}

export type Route = 'home' | 'events' | 'attendees' | 'schedule'
