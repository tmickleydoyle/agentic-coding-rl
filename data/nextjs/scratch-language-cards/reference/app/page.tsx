'use client'
import { useState } from 'react'

interface Card {
  id: number
  front: string
  back: string
  language: string
  known: boolean
  flipped: boolean
}

const SEED_CARDS = [
  { id: 1, front: 'Hola', back: 'Hello', language: 'Spanish', known: false },
  { id: 2, front: 'Gracias', back: 'Thank you', language: 'Spanish', known: false },
  { id: 3, front: 'Bonjour', back: 'Hello', language: 'French', known: false },
  { id: 4, front: 'Merci', back: 'Thank you', language: 'French', known: false },
  { id: 5, front: 'Ciao', back: 'Hello/Goodbye', language: 'Italian', known: false },
  { id: 6, front: 'Grazie', back: 'Thank you', language: 'Italian', known: false },
]

export default function App() {
  const [cards, setCards] = useState<Card[]>(
    SEED_CARDS.map(c => ({ ...c, flipped: false }))
  )
  const [filter, setFilter] = useState('All')

  const visibleCards = filter === 'All' ? cards : cards.filter(c => c.language === filter)
  const knownCount = visibleCards.filter(c => c.known).length

  function toggleFlip(id: number) {
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: !c.flipped } : c))
  }

  function toggleKnown(id: number) {
    setCards(prev => prev.map(c => c.id === id ? { ...c, known: !c.known } : c))
  }

  return (
    <div>
      <h1>Language Cards</h1>

      <select
        data-testid="language-filter"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Spanish">Spanish</option>
        <option value="French">French</option>
        <option value="Italian">Italian</option>
      </select>

      <div data-testid="card-count">
        {knownCount} / {visibleCards.length} cards
      </div>

      <div>
        {visibleCards.map(card => (
          <div
            key={card.id}
            data-testid={`card-${card.id}`}
            className={card.known ? 'known' : ''}
          >
            <span data-testid={`card-front-${card.id}`}>{card.front}</span>

            {card.flipped && (
              <span data-testid={`card-back-${card.id}`}>{card.back}</span>
            )}

            <button
              data-testid={`flip-${card.id}`}
              onClick={() => toggleFlip(card.id)}
            >
              {card.flipped ? 'Hide' : 'Show'}
            </button>

            <button
              data-testid={`known-${card.id}`}
              onClick={() => toggleKnown(card.id)}
            >
              {card.known ? 'Mark Unknown' : 'Mark Known'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
