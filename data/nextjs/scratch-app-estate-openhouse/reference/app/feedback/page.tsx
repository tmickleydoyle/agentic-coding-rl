'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

function toNumber(value: string): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export default function FeedbackPage() {
  const { houses, currentHouseId, addFeedback, navigate } = useApp()
  const [visitor, setVisitor] = useState('')
  const [rating, setRating] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const current = houses.find((h) => h.id === currentHouseId)
  if (!current) {
    return (
      <section data-testid="page-feedback">
        <p data-testid="no-house">No house selected.</p>
      </section>
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (visitor.trim().length === 0) {
      setError('Visitor is required')
      return
    }
    setError('')
    addFeedback(current.id, {
      visitor: visitor.trim(),
      rating: toNumber(rating),
      note: note.trim(),
    })
    setVisitor('')
    setRating('')
    setNote('')
    navigate('house-detail')
  }

  return (
    <section data-testid="page-feedback">
      <h1>Feedback</h1>
      <form data-testid="feedback-form" onSubmit={onSubmit}>
        <label htmlFor="visitor">Visitor</label>
        <input
          id="visitor"
          data-testid="visitor-input"
          value={visitor}
          onChange={(e) => setVisitor(e.target.value)}
        />
        <label htmlFor="rating">Rating</label>
        <input
          id="rating"
          type="number"
          min={1}
          max={5}
          data-testid="rating-input"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <label htmlFor="note">Note</label>
        <input
          id="note"
          data-testid="note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-feedback">
          Add feedback
        </button>
      </form>
    </section>
  )
}
