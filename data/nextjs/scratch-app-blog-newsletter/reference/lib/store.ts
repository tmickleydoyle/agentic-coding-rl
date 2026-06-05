import type { Campaign, Subscriber } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.
// Tests call __reset() in beforeEach for isolation.

let campaigns: Campaign[] = []
let subscribers: Subscriber[] = []
let nextCampaignId = 1
let nextSubscriberId = 1

function seed(): void {
  campaigns = [
    { id: 'm1', subject: 'Welcome', body: 'Hi there', status: 'sent', recipients: 4, opens: 2 },
    { id: 'm2', subject: 'Weekly Digest', body: 'News', status: 'draft', recipients: 0, opens: 0 },
  ]
  subscribers = [
    { id: 's1', email: 'ada@example.com', active: true },
    { id: 's2', email: 'lin@example.com', active: true },
    { id: 's3', email: 'old@example.com', active: false },
  ]
  nextCampaignId = 3
  nextSubscriberId = 4
}

seed()

export function __reset(): void {
  seed()
}

// Deterministic mock open rate: half the recipients open, rounded.
export function mockOpens(recipients: number): number {
  return Math.round(recipients * 0.5)
}

export function activeCount(): number {
  return subscribers.filter((s) => s.active).length
}

export function listCampaigns(filter?: { status?: string | null }): Campaign[] {
  let out = campaigns.slice()
  const status = filter?.status
  if (status === 'draft' || status === 'sent') out = out.filter((c) => c.status === status)
  return out
}

export function createCampaign(input: { subject: string; body?: string }): Campaign {
  const campaign: Campaign = {
    id: `m${nextCampaignId++}`,
    subject: input.subject,
    body: input.body ?? '',
    status: 'draft',
    recipients: 0,
    opens: 0,
  }
  campaigns.push(campaign)
  return campaign
}

export function findCampaign(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id)
}

export function sendCampaign(id: string): Campaign | undefined {
  const campaign = campaigns.find((c) => c.id === id)
  if (!campaign) return undefined
  const recipients = activeCount()
  campaign.status = 'sent'
  campaign.recipients = recipients
  campaign.opens = mockOpens(recipients)
  return campaign
}

export function deleteCampaign(id: string): boolean {
  const idx = campaigns.findIndex((c) => c.id === id)
  if (idx === -1) return false
  campaigns.splice(idx, 1)
  return true
}

export function listSubscribers(filter?: { active?: string | null }): Subscriber[] {
  let out = subscribers.slice()
  const active = filter?.active
  if (active === 'true') out = out.filter((s) => s.active)
  else if (active === 'false') out = out.filter((s) => !s.active)
  return out
}

export function createSubscriber(input: { email: string }): Subscriber {
  const subscriber: Subscriber = {
    id: `s${nextSubscriberId++}`,
    email: input.email,
    active: true,
  }
  subscribers.push(subscriber)
  return subscriber
}

export function findSubscriber(id: string): Subscriber | undefined {
  return subscribers.find((s) => s.id === id)
}

export function deleteSubscriber(id: string): boolean {
  const idx = subscribers.findIndex((s) => s.id === id)
  if (idx === -1) return false
  subscribers.splice(idx, 1)
  return true
}
