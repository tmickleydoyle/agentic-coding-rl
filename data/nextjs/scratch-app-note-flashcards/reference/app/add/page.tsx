'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AddPage() {
  const { selectedDeckId, addCard, navigate } = useApp()
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [error, setError] = useState('')

  if (!selectedDeckId) {
    return (
      <section data-testid="page-add">
        <h1>Add card</h1>
        <p data-testid="no-deck">Pick a deck first.</p>
      </section>
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (front.trim().length === 0 || back.trim().length === 0) {
      setError('Front and back are required')
      return
    }
    setError('')
    addCard({ deckId: selectedDeckId, front: front.trim(), back: back.trim() })
    navigate('study')
  }

  return (
    <section data-testid="page-add">
      <h1>Add card</h1>
      <form data-testid="card-form" onSubmit={onSubmit}>
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

        <button type="submit" data-testid="save-card">
          Save card
        </button>
      </form>
    </section>
  )
}
