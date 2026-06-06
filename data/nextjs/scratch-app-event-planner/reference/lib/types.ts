export interface Event { id: string; title: string; date: string; location: string; category: 'meeting'|'party'|'conference'|'other'; status: 'planned'|'ongoing'|'done' }
export interface Guest { id: string; name: string; email: string; eventId: string; eventTitle: string; rsvp: 'pending'|'confirmed'|'declined' }
export type Route = 'home'|'events'|'guests'|'agenda'
export interface AppState { route: Route; setRoute: (r: Route) => void }
