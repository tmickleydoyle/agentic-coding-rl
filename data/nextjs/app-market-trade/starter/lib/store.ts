import type { Item, Offer, Status } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `items`, `offers`, offer id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listItems(): Item[] {
  // TODO: return all items
  return []
}

export function listOffers(_filter?: { itemId?: string | null; status?: string | null }): Offer[] {
  // TODO: return offers, applying optional itemId + status filters
  return []
}

export function findOffer(_id: string): Offer | undefined {
  // TODO: look up an offer by id
  return undefined
}

export function createOffer(_input: { itemId: string; offeredBy?: string; give: string }): Offer {
  // TODO: append a pending offer with a fresh id and return it
  return { id: '', itemId: '', offeredBy: '', give: '', status: 'pending' }
}

export function setOfferStatus(_id: string, _status: Status): Offer | undefined {
  // TODO: set the offer's status and return it, or undefined if absent
  return undefined
}
