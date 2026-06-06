import { Event, Guest } from './types'
let events: Event[] = [
  { id: 'e1', title: 'Summer Party', date: '2024-07-04', location: 'Central Park', category: 'party', status: 'planned' },
  { id: 'e2', title: 'Q3 Review', date: '2024-06-15', location: 'Conference Room A', category: 'meeting', status: 'planned' },
]
let guests: Guest[] = [
  { id: 'g1', name: 'Alice', email: 'alice@example.com', eventId: 'e1', eventTitle: 'Summer Party', rsvp: 'confirmed' },
  { id: 'g2', name: 'Bob', email: 'bob@example.com', eventId: 'e1', eventTitle: 'Summer Party', rsvp: 'pending' },
  { id: 'g3', name: 'Carol', email: 'carol@example.com', eventId: 'e2', eventTitle: 'Q3 Review', rsvp: 'confirmed' },
]
let nextId = 100
function uid() { return String(++nextId) }
export function getEvents() { return [...events] }
export function addEvent(d: Omit<Event,'id'>): Event { const e = { id: uid(), ...d }; events.push(e); return e }
export function deleteEvent(id: string): boolean { const l = events.length; events = events.filter(e => e.id !== id); return events.length < l }
export function getGuests() { return [...guests] }
export function addGuest(d: Omit<Guest,'id'>): Guest { const g = { id: uid(), ...d }; guests.push(g); return g }
export function updateGuestRsvp(id: string, rsvp: Guest['rsvp']): boolean {
  const g = guests.find(x => x.id === id)
  if (!g) return false
  g.rsvp = rsvp; return true
}
export function __reset() {
  events = [
    { id: 'e1', title: 'Summer Party', date: '2024-07-04', location: 'Central Park', category: 'party', status: 'planned' },
    { id: 'e2', title: 'Q3 Review', date: '2024-06-15', location: 'Conference Room A', category: 'meeting', status: 'planned' },
  ]
  guests = [
    { id: 'g1', name: 'Alice', email: 'alice@example.com', eventId: 'e1', eventTitle: 'Summer Party', rsvp: 'confirmed' },
    { id: 'g2', name: 'Bob', email: 'bob@example.com', eventId: 'e1', eventTitle: 'Summer Party', rsvp: 'pending' },
    { id: 'g3', name: 'Carol', email: 'carol@example.com', eventId: 'e2', eventTitle: 'Q3 Review', rsvp: 'confirmed' },
  ]
  nextId = 100
}
