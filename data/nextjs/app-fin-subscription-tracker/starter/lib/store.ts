import type { Subscription } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `subscriptions` and an id counter; seed them; provide __reset()
// to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listSubscriptions(_filter?: { active?: string | null }): Subscription[] {
  // TODO: return subscriptions, applying optional active=true|false filter
  return []
}

export function createSubscription(_input: {
  name: string
  cost: number
  cycle: 'monthly' | 'annual'
  nextRenewal: string
}): Subscription {
  // TODO: append a new active subscription with a fresh id and return it
  return { id: '', name: '', cost: 0, cycle: 'monthly', nextRenewal: '', active: true }
}

export function findSubscription(_id: string): Subscription | undefined {
  // TODO: look up a subscription by id
  return undefined
}

export function cancelSubscription(_id: string): Subscription | undefined {
  // TODO: set active=false and return the subscription, or undefined if absent
  return undefined
}

export function deleteSubscription(_id: string): boolean {
  // TODO: remove the subscription; return whether it existed
  return false
}
