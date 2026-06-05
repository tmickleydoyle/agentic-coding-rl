'use client'
import { useReviews } from '../../components/AppStateProvider'
import { averageRating, topRated } from '../../hooks/useRatings'

export default function TopRatedPage() {
  const { products, reviews } = useReviews()
  const ranked = topRated(products, reviews)
  return (
    <section data-testid="page-top-rated">
      <h1>Top rated</h1>
      <ol data-testid="ranking-list">
        {ranked.map((p) => (
          <li key={p.id} data-testid={`rank-${p.id}`}>
            <span data-testid={`rank-${p.id}-name`}>{p.name}</span>
            <span data-testid={`rank-${p.id}-avg`}>{averageRating(reviews, p.id).toFixed(1)}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
