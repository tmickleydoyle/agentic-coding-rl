'use client'
import type { Word } from '../lib/types'

export default function PracticeCard({
  word,
  guess,
  feedback,
  onGuessChange,
  onCheck,
  onNext,
}: {
  word: Word
  guess: string
  feedback: { correct: boolean } | null
  onGuessChange: (value: string) => void
  onCheck: () => void
  onNext: () => void
}) {
  return (
    <div data-testid="practice-card">
      <p data-testid="prompt-term">{word.term}</p>
      <input
        data-testid="answer-input"
        value={guess}
        onChange={(e) => onGuessChange(e.target.value)}
      />
      <button data-testid="check-answer" onClick={onCheck}>
        Check
      </button>
      {feedback ? (
        <p data-testid="feedback" data-correct={feedback.correct ? 'true' : 'false'}>
          {feedback.correct ? 'Correct' : 'Wrong'}
        </p>
      ) : null}
      {feedback && !feedback.correct ? (
        <span data-testid="correct-answer">{word.answer}</span>
      ) : null}
      <button data-testid="next-word" onClick={onNext}>
        Next
      </button>
    </div>
  )
}
