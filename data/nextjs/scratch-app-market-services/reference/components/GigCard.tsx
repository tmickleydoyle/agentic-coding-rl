'use client'
import type { Gig } from '../lib/types'
import { averageRating } from '../hooks/useGigs'

export default function GigCard({
  gig,
  onView,
}: {
  gig: Gig
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`gig-${gig.id}`}>
      <span data-testid={`gig-${gig.id}-title`}>{gig.title}</span>
      <span data-testid={`gig-${gig.id}-category`}>{gig.category}</span>
      <span data-testid={`gig-${gig.id}-price`}>{gig.price}</span>
      <span data-testid={`gig-${gig.id}-rating`}>{averageRating(gig)}</span>
      <button data-testid={`view-${gig.id}`} onClick={() => onView(gig.id)}>
        View
      </button>
    </li>
  )
}
