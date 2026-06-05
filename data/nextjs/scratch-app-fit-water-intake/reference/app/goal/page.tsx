'use client'
import { useState } from 'react'
import { useWater } from '../../components/WaterProvider'
import { useIntake } from '../../hooks/useIntake'
import StatCard from '../../components/StatCard'

export default function GoalPage() {
  const { goal, setGoal } = useWater()
  const { todayTotal, percent, remaining } = useIntake()
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
      <div data-testid="stats">
        <StatCard label="Today" value={todayTotal} testid="today" />
        <StatCard label="Percent" value={percent} testid="percent" />
        <StatCard label="Remaining" value={remaining} testid="remaining" />
      </div>
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
