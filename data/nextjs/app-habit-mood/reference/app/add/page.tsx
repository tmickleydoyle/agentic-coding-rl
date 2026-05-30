'use client'
import { useState } from 'react'
import { useMood } from '../../components/MoodProvider'

export default function AddPage() {
  const { today, logMood, navigate } = useMood()
  const [score, setScore] = useState('')
  const [triggers, setTriggers] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(score)
    if (score.trim().length === 0 || Number.isNaN(n) || n < 1 || n > 5) {
      setError('Score must be a number from 1 to 5')
      return
    }
    setError('')
    const list = triggers
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
    logMood({ date: today, score: n, triggers: list })
    setScore('')
    setTriggers('')
    navigate('today')
  }

  return (
    <section data-testid="page-add">
      <h1>Log Mood</h1>
      <form data-testid="add-form" onSubmit={onSubmit}>
        <input
          data-testid="score-input"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <input
          data-testid="triggers-input"
          value={triggers}
          onChange={(e) => setTriggers(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-mood">
          Log mood
        </button>
      </form>
    </section>
  )
}
