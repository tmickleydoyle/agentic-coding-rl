'use client'
import { useState, useCallback } from 'react'

const SYMBOLS = ['🍎', '🍌', '🍇', '🍓', '🍑', '🍒', '🥝', '🍋']

type Card = { id: number; symbol: string; flipped: boolean; matched: boolean }

function createShuffledDeck(): Card[] {
  const deck: Card[] = []
  SYMBOLS.forEach((sym, i) => {
    deck.push({ id: i * 2, symbol: sym, flipped: false, matched: false })
    deck.push({ id: i * 2 + 1, symbol: sym, flipped: false, matched: false })
  })
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = deck[i]
    deck[i] = deck[j]
    deck[j] = tmp
  }
  return deck
}

export default function App() {
  const [cards, setCards] = useState<Card[]>(() => createShuffledDeck())
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [locked, setLocked] = useState(false)

  const handleCardClick = useCallback(
    (idx: number) => {
      if (locked) return
      const card = cards[idx]
      if (card.flipped || card.matched) return
      if (flippedIndices.length === 1 && flippedIndices[0] === idx) return

      const newCards = cards.map((c, i) => (i === idx ? { ...c, flipped: true } : c))
      setCards(newCards)

      if (flippedIndices.length === 0) {
        setFlippedIndices([idx])
      } else {
        const firstIdx = flippedIndices[0]
        setLocked(true)
        setMoves(m => m + 1)

        if (newCards[firstIdx].symbol === newCards[idx].symbol) {
          // Match
          const matched = newCards.map((c, i) =>
            i === firstIdx || i === idx ? { ...c, matched: true, flipped: false } : c
          )
          setCards(matched)
          setMatches(m => m + 1)
          setFlippedIndices([])
          setLocked(false)
        } else {
          // No match — flip back after delay
          setTimeout(() => {
            setCards(prev =>
              prev.map((c, i) =>
                i === firstIdx || i === idx ? { ...c, flipped: false } : c
              )
            )
            setFlippedIndices([])
            setLocked(false)
          }, 300)
        }
      }
    },
    [cards, flippedIndices, locked]
  )

  function handleNewGame() {
    setCards(createShuffledDeck())
    setFlippedIndices([])
    setMoves(0)
    setMatches(0)
    setLocked(false)
  }

  const won = matches === 8

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem', textAlign: 'center' }}>
      <h1>Memory Match</h1>
      <div style={{ marginBottom: '1rem' }}>
        <span>Moves: <strong data-testid="moves">{moves}</strong></span>
        {' | '}
        <span>Matches: <strong data-testid="matches">{matches}</strong></span>
      </div>
      {won && (
        <p data-testid="win-message" style={{ fontSize: '1.5rem', color: 'green' }}>
          You win!
        </p>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 80px)',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        {cards.map((card, idx) => (
          <button
            key={idx}
            data-testid={`card-${idx}`}
            onClick={() => handleCardClick(idx)}
            style={{
              width: 80,
              height: 80,
              fontSize: '2rem',
              cursor: card.matched ? 'default' : 'pointer',
              background: card.matched ? '#c8e6c9' : card.flipped ? '#fff9c4' : '#90a4ae',
              border: '2px solid #555',
              borderRadius: '8px',
            }}
          >
            {card.flipped || card.matched ? card.symbol : '?'}
          </button>
        ))}
      </div>
      <button data-testid="new-game-btn" onClick={handleNewGame}>
        New Game
      </button>
    </div>
  )
}
