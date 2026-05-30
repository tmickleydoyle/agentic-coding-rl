'use client'
import type { Listing } from '../lib/types'

export default function ListingCard({
  listing,
  favorited,
  onView,
  onToggleFavorite,
}: {
  listing: Listing
  favorited: boolean
  onView: (id: string) => void
  onToggleFavorite: (id: string) => void
}) {
  return (
    <li data-testid={`listing-${listing.id}`} data-favorited={favorited ? 'true' : 'false'}>
      <span data-testid={`listing-${listing.id}-title`}>{listing.title}</span>
      <span data-testid={`listing-${listing.id}-category`}>{listing.category}</span>
      <span data-testid={`listing-${listing.id}-price`}>{listing.price}</span>
      <button data-testid={`view-${listing.id}`} onClick={() => onView(listing.id)}>
        View
      </button>
      <button data-testid={`fav-${listing.id}`} onClick={() => onToggleFavorite(listing.id)}>
        {favorited ? 'Unfavorite' : 'Favorite'}
      </button>
    </li>
  )
}
