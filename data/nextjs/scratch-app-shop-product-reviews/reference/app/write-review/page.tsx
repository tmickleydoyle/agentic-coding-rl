'use client'
import { useState } from 'react'
import { useReviews } from '../../components/AppStateProvider'

export default function WriteReviewPage() {
  const { products, addReview, selectProduct } = useReviews()
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [rating, setRating] = useState('5')
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = Number(rating)
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      setError('Rating must be an integer from 1 to 5')
      return
    }
    if (text.trim().length === 0) {
      setError('Review text is required')
      return
    }
    setError('')
    addReview({ productId, rating: value, text: text.trim() })
    setText('')
    selectProduct(productId)
  }

  return (
    <section data-testid="page-write-review">
      <h1>Write a review</h1>
      <form data-testid="review-form" onSubmit={onSubmit}>
        <label htmlFor="product">Product</label>
        <select
          id="product"
          data-testid="product-select"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <label htmlFor="rating">Rating</label>
        <input
          id="rating"
          type="number"
          data-testid="rating-input"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <label htmlFor="text">Review</label>
        <textarea
          id="text"
          data-testid="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-review">
          Submit review
        </button>
      </form>
    </section>
  )
}
