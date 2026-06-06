import { Event, Attendee, Session } from './types'

export function __reset() {}
export function getEvents(): Event[] { return [] }
export function addEvent(_d: Omit<Event, 'id' | 'status'>): Event { return {} as Event }
export function getAttendees(): Attendee[] { return [] }
export function addAttendee(_d: Omit<Attendee, 'id' | 'registrationDate'>): Attendee { return {} as Attendee }
export function getSessions(): Session[] { return [] }
export function addSession(_d: Omit<Session, 'id'>): Session { return {} as Session }
