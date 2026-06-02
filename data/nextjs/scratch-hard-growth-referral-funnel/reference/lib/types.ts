export type Route = 'referrals' | 'sources' | 'funnel' | 'settings'
export const ROUTES: Route[] = ['referrals', 'sources', 'funnel', 'settings']

export type Referral = {
  id: number
  referrer: string
  source: string
  invites: number
  signups: number
}

export const SOURCES = ['Organic', 'Paid', 'Partner', 'Influencer']

// Bounty paid per successful signup.
export const BOUNTY_PER_SIGNUP = 20
