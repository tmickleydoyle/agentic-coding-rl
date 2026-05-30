'use client'
import { useApp } from '../components/AppStateProvider'
import type { Offer, StatusFilter } from '../lib/types'

export type OfferCounts = {
  total: number
  pending: number
  accepted: number
  declined: number
}

export function countOffers(_offers: Offer[]): OfferCounts {
  // TODO: count offers by status
  return { total: 0, pending: 0, accepted: 0, declined: 0 }
}

export function offersByItem(_offers: Offer[], _itemId: string): Offer[] {
  // TODO: offers for the given item
  return []
}

export function filterByStatus(_offers: Offer[], _statusFilter: StatusFilter): Offer[] {
  // TODO: apply the status filter
  return []
}

export function useTrades() {
  const { offers } = useApp()
  const counts = countOffers(offers)
  const offersForItem = (itemId: string) => offersByItem(offers, itemId)
  const myOffers: Offer[] = []
  return { counts, offersForItem, myOffers }
}
