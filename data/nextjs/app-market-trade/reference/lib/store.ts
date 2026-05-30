import type { Item, Offer, Status } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.

let items: Item[] = []
let offers: Offer[] = []
let nextOfferId = 1

function seed(): void {
  items = [
    { id: 'i1', name: 'Skateboard', owner: 'nina' },
    { id: 'i2', name: 'Guitar', owner: 'me' },
    { id: 'i3', name: 'Camera lens', owner: 'omar' },
  ]
  offers = [
    { id: 'of1', itemId: 'i2', offeredBy: 'tom', give: 'Headphones', status: 'pending' },
    { id: 'of2', itemId: 'i2', offeredBy: 'uma', give: 'Books', status: 'accepted' },
    { id: 'of3', itemId: 'i1', offeredBy: 'me', give: 'Old phone', status: 'pending' },
  ]
  nextOfferId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listItems(): Item[] {
  return items.slice()
}

export function listOffers(filter?: { itemId?: string | null; status?: string | null }): Offer[] {
  let out = offers.slice()
  const itemId = filter?.itemId
  if (itemId) out = out.filter((o) => o.itemId === itemId)
  const status = filter?.status
  if (status) out = out.filter((o) => o.status === status)
  return out
}

export function findOffer(id: string): Offer | undefined {
  return offers.find((o) => o.id === id)
}

export function createOffer(input: { itemId: string; offeredBy?: string; give: string }): Offer {
  const offer: Offer = {
    id: `of${nextOfferId++}`,
    itemId: input.itemId,
    offeredBy: input.offeredBy ?? 'unknown',
    give: input.give,
    status: 'pending',
  }
  offers.push(offer)
  return offer
}

export function setOfferStatus(id: string, status: Status): Offer | undefined {
  const offer = offers.find((o) => o.id === id)
  if (!offer) return undefined
  offer.status = status
  return offer
}
