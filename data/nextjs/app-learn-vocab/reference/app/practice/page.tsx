'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useActiveList } from '../../hooks/useVocab'
import PracticeCard from '../../components/PracticeCard'

export default function PracticePage() {
  const { activeListId, answerWord, nextWord } = useApp()
  const { list, word } = useActiveList()
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState<{ correct: boolean } | null>(null)

  if (!list || !word || !activeListId) {
    return (
      <section data-testid="page-practice">
        <p data-testid="no-list">No list selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-practice">
      <h1 data-testid="practice-title">{list.name}</h1>
      <PracticeCard
        word={word}
        guess={guess}
        feedback={feedback}
        onGuessChange={setGuess}
        onCheck={() => {
          const correct = answerWord(activeListId, word.id, guess)
          setFeedback({ correct })
        }}
        onNext={() => {
          nextWord()
          setGuess('')
          setFeedback(null)
        }}
      />
    </section>
  )
}
