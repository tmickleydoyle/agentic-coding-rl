export type Status = 'pending' | 'invited'
export type StatusFilter = 'all' | 'pending' | 'invited'
export type Source = 'twitter' | 'linkedin' | 'referral' | 'other'
export type Route = 'waitlist' | 'stats' | 'settings'
export type Entry = { id: number; email: string; source: Source; status: Status }
