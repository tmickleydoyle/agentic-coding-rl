export interface Book { id: string; title: string; author: string; genre: string; year: number; status: 'reading'|'finished'|'wishlist' }
export interface Review { id: string; bookId: string; bookTitle: string; memberId: string; memberName: string; rating: number; text: string; date: string }
export interface Member { id: string; name: string; joinDate: string }
export type Route = 'home'|'books'|'reviews'|'members'
export interface AppState { route: Route; setRoute: (r: Route) => void }
