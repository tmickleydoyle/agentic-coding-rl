'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AddCardPage() {
  const { decks, activeDeckId, addCard, navigate } = useApp()
  const [deckId, setDeckId] = useState(activeDeckId ?? decks[0]?.id ?? '')
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (front.trim().length === 0 || back.trim().length === 0) {
      setError('Both sides are required')
      return
    }
    setError('')
    addCard(deckId, { front: front.trim(), back: back.trim() })
    setFront('')
    setBack('')
    navigate('decks')
  }

  return (
    <section data-testid="page-add-card">
      <h1>Add Card</h1>
      <form data-testid="add-card-form" onSubmit={onSubmit}>
        <label htmlFor="deck">Deck</label>
        <select
          id="deck"
          data-testid="deck-select"
          value={deckId}
          onChange={(e) => setDeckId(e.target.value)}
        >
          {decks.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <label htmlFor="front">Front</label>
        <input
          id="front"
          data-testid="front-input"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />

        <label htmlFor="back">Back</label>
        <input
          id="back"
          data-testid="back-input"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-card">
          Add card
        </button>
      </form>
    </section>
  )
}
