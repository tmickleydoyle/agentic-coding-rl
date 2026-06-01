export type Rsvp = 'yes' | 'no' | 'maybe' | 'pending'

export type Invite = {
  id: string
  guest: string
  status: Rsvp
  extraGuests: number
}

export type EventItem = {
  id: string
  name: string
  date: string
  invites: Invite[]
}

export type Route = 'events' | 'invite-detail' | 'create' | 'responses'
export type Theme = 'light' | 'dark'

export const RSVP_VALUES: Rsvp[] = ['yes', 'no', 'maybe', 'pending']
