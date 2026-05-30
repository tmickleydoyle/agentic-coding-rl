'use client'
import type { Listing } from '../lib/types'

export default function ListingCard(_props: {
  listing: Listing
  favorited: boolean
  onView: (id: string) => void
  onToggleFavorite: (id: string) => void
}) {
  // TODO: render a listing row with title/category/price, a view-<id> and fav-<id> button.
  return <li data-testid={`listing-${_props.listing.id}`} />
}
