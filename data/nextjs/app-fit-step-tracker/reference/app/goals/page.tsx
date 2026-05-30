'use client'
import { useState } from 'react'
import { useStep } from '../../components/StepProvider'

export default function GoalsPage() {
  const { goal, setGoal } = useStep()
  const [value, setValue] = useState(String(goal))
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(value)
    if (value.trim().length === 0 || Number.isNaN(n) || n <= 0) {
      setError('Goal must be a positive number')
      return
    }
    setError('')
    setGoal(n)
  }

  return (
    <section data-testid="page-goals">
      <h1>Goals</h1>
      <p data-testid="current-goal">{goal}</p>
      <form data-testid="goal-form" onSubmit={onSubmit}>
        <input
          data-testid="goal-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-goal">
          Save goal
        </button>
      </form>
    </section>
  )
}
