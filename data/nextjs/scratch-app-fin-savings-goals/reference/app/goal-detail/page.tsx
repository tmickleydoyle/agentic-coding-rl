'use client'
import { useState } from 'react'
import { useGoals } from '../../components/GoalsProvider'
import {
  isComplete,
  progressPercent,
  projectedCompletion,
  remainingAmount,
} from '../../hooks/useGoals'

export default function GoalDetailPage() {
  const { goals, contributions, selectedGoalId, contribute } = useGoals()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const goal = goals.find((g) => g.id === selectedGoalId)

  if (!goal) {
    return (
      <section data-testid="page-goal-detail">
        <p data-testid="no-goal-selected">No goal selected.</p>
      </section>
    )
  }

  const goalContributions = contributions.filter((c) => c.goalId === goal.id)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(amount)
    if (amount.trim().length === 0 || Number.isNaN(parsed) || parsed <= 0) {
      setError('Enter a positive amount')
      return
    }
    setError('')
    contribute(goal.id, parsed)
    setAmount('')
  }

  return (
    <section data-testid="page-goal-detail">
      <h1 data-testid="detail-name">{goal.name}</h1>
      <p data-testid="detail-saved">{goal.saved}</p>
      <p data-testid="detail-target">{goal.target}</p>
      <p data-testid="detail-percent">{progressPercent(goal)}</p>
      <p data-testid="detail-remaining">{remainingAmount(goal)}</p>
      <p data-testid="detail-completion">{projectedCompletion(goal)}</p>
      {isComplete(goal) ? <p data-testid="detail-complete">Goal reached!</p> : null}

      <form data-testid="contribute-form" onSubmit={onSubmit}>
        <input
          data-testid="amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-contribution">
          Add contribution
        </button>
      </form>

      <ul data-testid="contribution-list">
        {goalContributions.map((c) => (
          <li key={c.id} data-testid={`contribution-${c.id}`}>
            <span data-testid={`contribution-${c.id}-amount`}>{c.amount}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
