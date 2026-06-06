'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Review, Product } from '../../lib/types'

export function ReviewsPage() {
  const { triggerRefresh } = useApp()
  const [reviews, setReviews] = useState<Review[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productId, setProductId] = useState('')
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')
  const [reviewer, setReviewer] = useState('')

  function load() {
    fetch('/api/reviews').then(r => r.json()).then(setReviews)
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, rating: Number(rating), comment, reviewer }),
    })
    setProductId(''); setRating('5'); setComment(''); setReviewer('')
    load(); triggerRefresh()
  }

  function productName(id: string) { return products.find(p => p.id === id)?.name ?? id }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Reviews</h1>
      <form data-testid="add-review-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <select data-testid="select-review-product" value={productId} onChange={e => setProductId(e.target.value)} required>
          <option value="">Select product</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input data-testid="input-review-rating" type="number" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} required />
        <input data-testid="input-review-comment" value={comment} onChange={e => setComment(e.target.value)} placeholder="Comment" required />
        <input data-testid="input-review-reviewer" value={reviewer} onChange={e => setReviewer(e.target.value)} placeholder="Your name" required />
        <button data-testid="btn-add-review" type="submit">Add Review</button>
      </form>
      <ul data-testid="review-list" style={{ listStyle: 'none', padding: 0 }}>
        {reviews.map(r => (
          <li key={r.id} data-testid="review-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="review-product" style={{ fontWeight: 'bold' }}>{productName(r.productId)}</span>
            {' | '}
            <span data-testid="review-rating">{'★'.repeat(r.rating)}</span>
            {' | '}
            <span data-testid="review-comment">{r.comment}</span>
            {' — '}
            <span data-testid="review-reviewer">{r.reviewer}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
