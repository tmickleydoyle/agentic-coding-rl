import type { Campaign, Subscriber } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `campaigns`, `subscribers`, and id counters; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listCampaigns(_filter?: { status?: string | null }): Campaign[] {
  // TODO: return campaigns, applying an optional status filter
  return []
}

export function createCampaign(_input: { subject: string; body?: string }): Campaign {
  // TODO: append a new draft campaign with a fresh id and return it
  return { id: '', subject: '', body: '', status: 'draft', recipients: 0, opens: 0 }
}

export function findCampaign(_id: string): Campaign | undefined {
  // TODO: look up a campaign by id
  return undefined
}

export function sendCampaign(_id: string): Campaign | undefined {
  // TODO: mark sent; recipients = active-subscriber count; opens = round(recipients*0.5)
  return undefined
}

export function deleteCampaign(_id: string): boolean {
  // TODO: remove the campaign; return whether it existed
  return false
}

export function listSubscribers(_filter?: { active?: string | null }): Subscriber[] {
  // TODO: return subscribers, applying an optional active filter ('true'/'false')
  return []
}

export function createSubscriber(_input: { email: string }): Subscriber {
  // TODO: append a new active subscriber with a fresh id and return it
  return { id: '', email: '', active: true }
}

export function findSubscriber(_id: string): Subscriber | undefined {
  // TODO: look up a subscriber by id
  return undefined
}

export function deleteSubscriber(_id: string): boolean {
  // TODO: remove the subscriber; return whether it existed
  return false
}
