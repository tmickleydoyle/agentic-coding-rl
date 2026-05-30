'use client'
import { useReviews } from '../../components/AppStateProvider'
import { averageRating, reviewsFor } from '../../hooks/useRatings'

export default function ProductsPage() {
  const { products, reviews, theme, setTheme, selectProduct } = useReviews()
  return (
    <section data-testid="page-products">
      <h1>Products</h1>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      <ul data-testid="product-list">
        {products.map((p) => (
          <li key={p.id} data-testid={`product-${p.id}`}>
            <span data-testid={`product-${p.id}-name`}>{p.name}</span>
            <span data-testid={`product-${p.id}-avg`}>
              {averageRating(reviews, p.id).toFixed(1)}
            </span>
            <span data-testid={`product-${p.id}-count`}>{reviewsFor(reviews, p.id).length}</span>
            <button data-testid={`view-${p.id}`} onClick={() => selectProduct(p.id)}>
              View reviews
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
