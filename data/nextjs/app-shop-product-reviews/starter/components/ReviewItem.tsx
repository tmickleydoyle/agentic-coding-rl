'use client'
import type { Review } from '../lib/types'

export default function ReviewItem({
  review,
  onRemove,
}: {
  review: Review
  onRemove: (id: string) => void
}) {
  // TODO: render rating, text, and a remove button
  void onRemove
  return <li data-testid={`review-${review.id}`} />
}
