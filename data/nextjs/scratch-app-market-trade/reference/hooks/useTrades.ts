'use client'
import { useApp } from '../components/AppStateProvider'
import type { Offer, StatusFilter } from '../lib/types'
import { ME } from '../lib/types'

export type OfferCounts = {
  total: number
  pending: number
  accepted: number
  declined: number
}

export function countOffers(offers: Offer[]): OfferCounts {
  let pending = 0
  let accepted = 0
  let declined = 0
  offers.forEach((o) => {
    if (o.status === 'pending') pending += 1
    else if (o.status === 'accepted') accepted += 1
    else declined += 1
  })
  return { total: offers.length, pending, accepted, declined }
}

export function offersByItem(offers: Offer[], itemId: string): Offer[] {
  return offers.filter((o) => o.itemId === itemId)
}

export function filterByStatus(offers: Offer[], statusFilter: StatusFilter): Offer[] {
  return offers.filter((o) => statusFilter === 'all' || o.status === statusFilter)
}

export function useTrades() {
  const { offers } = useApp()
  const counts = countOffers(offers)
  const offersForItem = (itemId: string) => offersByItem(offers, itemId)
  const myOffers = offers.filter((o) => o.offeredBy === ME)
  return { counts, offersForItem, myOffers }
}
