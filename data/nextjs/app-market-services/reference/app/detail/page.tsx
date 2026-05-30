'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { averageRating } from '../../hooks/useGigs'

export default function DetailPage() {
  const { gigs, selectedId, addReview, navigate } = useApp()
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState('5')
  const [text, setText] = useState('')
  const gig = gigs.find((g) => g.id === selectedId)

  if (!gig) {
    return (
      <section data-testid="page-detail">
        <p data-testid="no-selection">No gig selected.</p>
      </section>
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (author.trim().length === 0) return
    addReview(gig.id, { author: author.trim(), rating: Number(rating), text: text.trim() })
    setAuthor('')
    setText('')
  }

  return (
    <section data-testid="page-detail">
      <h1 data-testid="detail-title">{gig.title}</h1>
      <p data-testid="detail-price">{gig.price}</p>
      <p data-testid="detail-rating">{averageRating(gig)}</p>
      <button data-testid="book-this" onClick={() => navigate('book')}>
        Book this gig
      </button>
      {gig.reviews.length === 0 ? (
        <p data-testid="no-reviews">No reviews yet.</p>
      ) : (
        <ul data-testid="review-list">
          {gig.reviews.map((r) => (
            <li key={r.id} data-testid={`review-${r.id}`}>
              <span data-testid={`review-${r.id}-author`}>{r.author}</span>
              <span data-testid={`review-${r.id}-rating`}>{r.rating}</span>
              <span data-testid={`review-${r.id}-text`}>{r.text}</span>
            </li>
          ))}
        </ul>
      )}
      <form data-testid="review-form" onSubmit={onSubmit}>
        <label htmlFor="review-author">Your name</label>
        <input
          id="review-author"
          data-testid="review-author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <label htmlFor="review-rating">Rating</label>
        <input
          id="review-rating"
          type="number"
          data-testid="review-rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <label htmlFor="review-text">Review</label>
        <input
          id="review-text"
          data-testid="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" data-testid="submit-review">
          Add review
        </button>
      </form>
    </section>
  )
}
