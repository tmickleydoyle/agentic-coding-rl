'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { maxScore } from '../../lib/quiz'

export default function ResultsPage() {
  const { quiz, lastScore, submit, restart, navigate } = useApp()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = submit(name)
    if (id === null) {
      setError('A name is required')
      return
    }
    setError('')
    navigate('leaderboard')
  }

  return (
    <section data-testid="page-results">
      <h1>Results</h1>
      <span data-testid="final-score">{lastScore === null ? '-' : lastScore}</span>
      <span data-testid="max-score">{maxScore(quiz)}</span>
      <form data-testid="save-form" onSubmit={onSubmit}>
        <input
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error ? <p data-testid="results-error">{error}</p> : null}
        <button type="submit" data-testid="save-score">
          Save score
        </button>
      </form>
      <button data-testid="play-again" onClick={restart}>
        Play again
      </button>
    </section>
  )
}
