'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useActiveDeck } from '../../hooks/useSrs'
import CardFace from '../../components/CardFace'

export default function ReviewPage() {
  const { activeDeckId, gradeCard } = useApp()
  const { deck, due } = useActiveDeck()
  const [showBack, setShowBack] = useState(false)

  if (!deck || !activeDeckId) {
    return (
      <section data-testid="page-review">
        <p data-testid="no-deck">No deck selected.</p>
      </section>
    )
  }

  if (due.length === 0) {
    return (
      <section data-testid="page-review">
        <h1 data-testid="review-title">{deck.name}</h1>
        <p data-testid="all-done">All caught up!</p>
      </section>
    )
  }

  const current = due[0]

  return (
    <section data-testid="page-review">
      <h1 data-testid="review-title">{deck.name}</h1>
      <CardFace
        card={current}
        showBack={showBack}
        onShowBack={() => setShowBack(true)}
        onGrade={(grade) => {
          gradeCard(activeDeckId, current.id, grade)
          setShowBack(false)
        }}
      />
    </section>
  )
}
