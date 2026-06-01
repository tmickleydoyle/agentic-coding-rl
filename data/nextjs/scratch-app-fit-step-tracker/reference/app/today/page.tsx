'use client'
import { useState } from 'react'
import { useStep } from '../../components/StepProvider'

export default function TodayPage() {
  const { entries, goal, today, logSteps } = useStep()
  const todayEntry = entries.find((e) => e.date === today)
  const [steps, setSteps] = useState('')
  const [error, setError] = useState('')

  const current = todayEntry?.steps ?? 0
  const percent = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0
  const met = current >= goal

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(steps)
    if (steps.trim().length === 0 || Number.isNaN(n) || n < 0) {
      setError('Enter a valid step count')
      return
    }
    setError('')
    logSteps({ date: today, steps: n })
    setSteps('')
  }

  return (
    <section data-testid="page-today">
      <h1>Today</h1>
      <p data-testid="today-date">{today}</p>
      <p data-testid="today-steps">{current}</p>
      <p data-testid="today-goal">{goal}</p>
      <p data-testid="today-percent">{percent}</p>
      <p data-testid="today-met" data-met={met ? 'true' : 'false'}>
        {met ? 'Goal met' : 'Keep going'}
      </p>
      <form data-testid="log-form" onSubmit={onSubmit}>
        <input
          data-testid="steps-input"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-steps">
          Log steps
        </button>
      </form>
    </section>
  )
}
