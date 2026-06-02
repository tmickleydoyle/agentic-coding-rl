export type Status = 'pending' | 'invited'
export type StatusFilter = 'All' | 'Pending' | 'Invited'
export type Source = 'Twitter' | 'Reddit' | 'Direct'
export type Route = 'waitlist' | 'stats' | 'settings'
export type Entry = { id: number; email: string; status: Status; source: Source }
