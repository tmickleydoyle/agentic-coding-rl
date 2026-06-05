export type Status = 'pending' | 'invited'
export type Source = 'Twitter' | 'LinkedIn' | 'Referral' | 'Other'
export type StatusFilter = 'All' | 'Pending' | 'Invited'
export type Route = 'waitlist' | 'stats' | 'settings'
export type Entry = {
  id: number
  email: string
  status: Status
  source: Source
}
