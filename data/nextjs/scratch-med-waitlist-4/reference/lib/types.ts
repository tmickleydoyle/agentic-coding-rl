export type Status = 'pending' | 'invited'
export type Route = 'waitlist' | 'stats' | 'settings'
export type Entry = { id: number; email: string; source: string; status: Status }
