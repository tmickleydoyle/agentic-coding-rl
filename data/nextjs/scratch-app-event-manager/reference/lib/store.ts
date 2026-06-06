import { Event, Attendee, Session } from './types'

const seedEvents: Event[] = [
  { id: 'ev1', name: 'Tech Summit 2024', date: '2024-06-15', venue: 'Convention Center', capacity: 500, status: 'upcoming' },
  { id: 'ev2', name: 'Design Workshop', date: '2024-03-20', venue: 'Studio A', capacity: 30, status: 'completed' },
  { id: 'ev3', name: 'Startup Pitch Night', date: '2024-07-10', venue: 'Innovation Hub', capacity: 100, status: 'upcoming' },
  { id: 'ev4', name: 'AI Conference', date: '2024-08-05', venue: 'Grand Hall', capacity: 800, status: 'upcoming' },
]

const seedAttendees: Attendee[] = [
  { id: 'a1', name: 'John Doe', email: 'john@example.com', eventId: 'ev1', registrationDate: '2024-05-01' },
  { id: 'a2', name: 'Jane Smith', email: 'jane@example.com', eventId: 'ev1', registrationDate: '2024-05-02' },
  { id: 'a3', name: 'Mike Brown', email: 'mike@example.com', eventId: 'ev2', registrationDate: '2024-03-01' },
  { id: 'a4', name: 'Sara Lee', email: 'sara@example.com', eventId: 'ev3', registrationDate: '2024-06-15' },
  { id: 'a5', name: 'Tom Clark', email: 'tom@example.com', eventId: 'ev4', registrationDate: '2024-07-01' },
]

const seedSessions: Session[] = [
  { id: 's1', title: 'Opening Keynote', eventId: 'ev1', startTime: '09:00', endTime: '10:00', speaker: 'Dr. Alice' },
  { id: 's2', title: 'Panel: Future of AI', eventId: 'ev1', startTime: '10:30', endTime: '12:00', speaker: 'Panel' },
  { id: 's3', title: 'Workshop Intro', eventId: 'ev2', startTime: '14:00', endTime: '16:00', speaker: 'Bob Jones' },
]

let events: Event[] = seedEvents.map(e => ({ ...e }))
let attendees: Attendee[] = seedAttendees.map(a => ({ ...a }))
let sessions: Session[] = seedSessions.map(s => ({ ...s }))
let nextId = 100

export function __reset() {
  events = seedEvents.map(e => ({ ...e }))
  attendees = seedAttendees.map(a => ({ ...a }))
  sessions = seedSessions.map(s => ({ ...s }))
  nextId = 100
}

export function getEvents(): Event[] { return events }
export function addEvent(data: Omit<Event, 'id' | 'status'>): Event {
  const ev: Event = { ...data, id: `ev${nextId++}`, status: 'upcoming' }
  events.push(ev)
  return ev
}

export function getAttendees(): Attendee[] { return attendees }
export function addAttendee(data: Omit<Attendee, 'id' | 'registrationDate'>): Attendee {
  const a: Attendee = { ...data, id: `a${nextId++}`, registrationDate: new Date().toISOString().slice(0, 10) }
  attendees.push(a)
  return a
}

export function getSessions(): Session[] { return sessions }
export function addSession(data: Omit<Session, 'id'>): Session {
  const s: Session = { ...data, id: `s${nextId++}` }
  sessions.push(s)
  return s
}
