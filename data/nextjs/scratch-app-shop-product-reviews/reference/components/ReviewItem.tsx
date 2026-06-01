'use client'
import type { Review } from '../lib/types'

export default function ReviewItem({
  review,
  onRemove,
}: {
  review: Review
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`review-${review.id}`}>
      <span data-testid={`review-${review.id}-rating`}>{review.rating}</span>
      <span data-testid={`review-${review.id}-text`}>{review.text}</span>
      <button data-testid={`remove-${review.id}`} onClick={() => onRemove(review.id)}>
        Delete
      </button>
    </li>
  )
}
