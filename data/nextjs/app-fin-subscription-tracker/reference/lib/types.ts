export type Cycle = 'monthly' | 'annual'

export type Subscription = {
  id: string
  name: string
  cost: number
  cycle: Cycle
  nextRenewal: string
  active: boolean
}

export type Route = 'dashboard' | 'subscriptions' | 'add' | 'upcoming'
export type Theme = 'light' | 'dark'

// Fixed reference date so "due soon" / days-until calculations are deterministic in tests.
export const TODAY = '2026-05-29'
export const DUE_SOON_DAYS = 14
