'use client'
import type { Card, Grade } from '../lib/types'

export default function CardFace({
  card,
  showBack,
  onShowBack,
  onGrade,
}: {
  card: Card
  showBack: boolean
  onShowBack: () => void
  onGrade: (grade: Grade) => void
}) {
  return (
    <div data-testid="current-card">
      <p data-testid="card-front">{card.front}</p>
      {showBack ? <p data-testid="card-back">{card.back}</p> : null}
      <button data-testid="show-back" onClick={onShowBack}>
        Show back
      </button>
      <button data-testid="grade-easy" onClick={() => onGrade('easy')}>
        Easy
      </button>
      <button data-testid="grade-hard" onClick={() => onGrade('hard')}>
        Hard
      </button>
    </div>
  )
}
