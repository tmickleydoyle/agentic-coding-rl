export type Source = 'organic' | 'referral' | 'social'
export type EntryStatus = 'pending' | 'invited'
export type StatusFilter = 'all' | 'pending' | 'invited'
export type Route = 'waitlist' | 'stats' | 'settings'
export type Entry = { id: number; email: string; source: Source; status: EntryStatus }
