'use client'
import { useApp } from '../../components/AppStateProvider'
import { useDeck } from '../../hooks/useDeck'

export default function StudyPage() {
  const { selectedDeckId, flipped, flip, markKnown, nextCard } = useApp()
  const { currentCard, progress } = useDeck()

  if (!selectedDeckId) {
    return (
      <section data-testid="page-study">
        <h1>Study</h1>
        <p data-testid="no-deck">Pick a deck first.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-study">
      <h1>Study</h1>
      <p data-testid="study-progress">
        {progress.known}/{progress.total}
      </p>
      {!currentCard ? (
        <p data-testid="study-empty">This deck has no cards.</p>
      ) : (
        <div data-testid="study-card" data-flipped={flipped ? 'true' : 'false'}>
          <p data-testid="card-face">{flipped ? currentCard.back : currentCard.front}</p>
          <button data-testid="flip-card" onClick={() => flip()}>
            Flip
          </button>
          <button data-testid="mark-known" onClick={() => markKnown(currentCard.id, true)}>
            Known
          </button>
          <button data-testid="mark-unknown" onClick={() => markKnown(currentCard.id, false)}>
            Unknown
          </button>
          <button data-testid="next-card" onClick={() => nextCard()}>
            Next
          </button>
        </div>
      )}
    </section>
  )
}
