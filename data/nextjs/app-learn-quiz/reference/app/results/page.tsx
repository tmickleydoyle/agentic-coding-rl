'use client'
import { useApp } from '../../components/AppStateProvider'
import { useActiveQuiz } from '../../hooks/useQuiz'

export default function ResultsPage() {
  const { submitted, resetAttempt, navigate } = useApp()
  const { quiz, score } = useActiveQuiz()

  if (!submitted || !quiz || !score) {
    return (
      <section data-testid="page-results">
        <p data-testid="no-results">No results yet.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-results">
      <h1>Results</h1>
      <span data-testid="score-value">{score.correct}</span>
      <span data-testid="total-value">{score.total}</span>
      <p data-testid="pass-fail" data-passed={score.passed ? 'true' : 'false'}>
        {score.passed ? 'Passed' : 'Failed'}
      </p>
      <button data-testid="review-button" onClick={() => navigate('review')}>
        Review answers
      </button>
      <button
        data-testid="retake-button"
        onClick={() => {
          resetAttempt()
          navigate('take')
        }}
      >
        Retake
      </button>
    </section>
  )
}
