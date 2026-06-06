import { Event, Guest } from './types'
export function getEvents(): Event[] { return [] }
export function addEvent(_d: Omit<Event,'id'>): Event { return { id:'',title:'',date:'',location:'',category:'other',status:'planned' } }
export function deleteEvent(_id: string): boolean { return false }
export function getGuests(): Guest[] { return [] }
export function addGuest(_d: Omit<Guest,'id'>): Guest { return { id:'',name:'',email:'',eventId:'',eventTitle:'',rsvp:'pending' } }
export function updateGuestRsvp(_id: string, _rsvp: Guest['rsvp']): boolean { return false }
export function __reset() {}
