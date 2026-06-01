'use client'
import { useState } from 'react'
import { useWeight } from '../../components/WeightProvider'
import { useInsights } from '../../hooks/useInsights'

export default function GoalPage() {
  const { goal, setGoal } = useWeight()
  const { progress, reached } = useInsights()
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
    <section data-testid="page-goal">
      <h1>Goal</h1>
      <p data-testid="current-goal">{goal}</p>
      <p data-testid="goal-progress">{progress}</p>
      <p data-testid="goal-reached" data-reached={reached ? 'true' : 'false'}>
        {reached ? 'Goal reached' : 'In progress'}
      </p>
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
