'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function BookPage() {
  const { gigs, selectedId, book, navigate } = useApp()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const gig = gigs.find((g) => g.id === selectedId)

  if (!gig) {
    return (
      <section data-testid="page-book">
        <p data-testid="no-selection">No gig selected.</p>
      </section>
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = book(gig.id, name)
    if (!ok) {
      setError('Name is required')
      return
    }
    setError('')
    setName('')
    navigate('bookings')
  }

  return (
    <section data-testid="page-book">
      <h1>Book {gig.title}</h1>
      <form data-testid="book-form" onSubmit={onSubmit}>
        <label htmlFor="book-name">Your name</label>
        <input
          id="book-name"
          data-testid="book-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-booking">
          Confirm booking
        </button>
      </form>
    </section>
  )
}
