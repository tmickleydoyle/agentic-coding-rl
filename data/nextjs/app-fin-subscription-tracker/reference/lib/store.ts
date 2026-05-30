import type { Subscription } from './types'

// In-memory server store for the API routes. SEPARATE from the client SubsProvider state.
// Tests call __reset() in beforeEach for isolation.

let subscriptions: Subscription[] = []
let nextId = 1

function seed(): void {
  subscriptions = [
    { id: 's1', name: 'Netflix', cost: 15, cycle: 'monthly', nextRenewal: '2026-06-05', active: true },
    { id: 's2', name: 'Spotify', cost: 10, cycle: 'monthly', nextRenewal: '2026-06-20', active: true },
    { id: 's3', name: 'Amazon Prime', cost: 120, cycle: 'annual', nextRenewal: '2026-06-02', active: true },
    { id: 's4', name: 'Old Gym', cost: 30, cycle: 'monthly', nextRenewal: '2026-06-01', active: false },
  ]
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listSubscriptions(filter?: { active?: string | null }): Subscription[] {
  let out = subscriptions.slice()
  const active = filter?.active
  if (active === 'true') out = out.filter((s) => s.active)
  else if (active === 'false') out = out.filter((s) => !s.active)
  return out
}

export function createSubscription(input: {
  name: string
  cost: number
  cycle: 'monthly' | 'annual'
  nextRenewal: string
}): Subscription {
  const sub: Subscription = {
    id: `s${nextId++}`,
    name: input.name,
    cost: input.cost,
    cycle: input.cycle,
    nextRenewal: input.nextRenewal,
    active: true,
  }
  subscriptions.push(sub)
  return sub
}

export function findSubscription(id: string): Subscription | undefined {
  return subscriptions.find((s) => s.id === id)
}

export function cancelSubscription(id: string): Subscription | undefined {
  const sub = subscriptions.find((s) => s.id === id)
  if (!sub) return undefined
  sub.active = false
  return sub
}

export function deleteSubscription(id: string): boolean {
  const idx = subscriptions.findIndex((s) => s.id === id)
  if (idx === -1) return false
  subscriptions.splice(idx, 1)
  return true
}
