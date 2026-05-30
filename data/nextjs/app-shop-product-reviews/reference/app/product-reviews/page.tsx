'use client'
import { useReviews } from '../../components/AppStateProvider'
import { useRatings } from '../../hooks/useRatings'
import ReviewItem from '../../components/ReviewItem'
import type { SortBy } from '../../lib/types'

export default function ProductReviewsPage() {
  const { products, selectedId, sortBy, setSortBy, removeReview } = useReviews()
  const { average, sorted } = useRatings()

  if (!selectedId) {
    return (
      <section data-testid="page-product-reviews">
        <p data-testid="no-selection">Select a product to see its reviews.</p>
      </section>
    )
  }

  const product = products.find((p) => p.id === selectedId)

  return (
    <section data-testid="page-product-reviews">
      <h2 data-testid="selected-name">{product?.name ?? 'Unknown'}</h2>
      <p data-testid="selected-avg">{average.toFixed(1)}</p>
      <label htmlFor="sort">Sort</label>
      <select
        id="sort"
        data-testid="sort-select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortBy)}
      >
        <option value="rating">rating</option>
        <option value="date">date</option>
      </select>
      {sorted.length === 0 ? (
        <p data-testid="empty-reviews">No reviews yet.</p>
      ) : (
        <ul data-testid="review-list">
          {sorted.map((r) => (
            <ReviewItem key={r.id} review={r} onRemove={removeReview} />
          ))}
        </ul>
      )}
    </section>
  )
}
