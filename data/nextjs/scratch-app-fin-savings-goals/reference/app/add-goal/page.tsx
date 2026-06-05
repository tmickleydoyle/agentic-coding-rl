'use client'
import { useState } from 'react'
import { useGoals } from '../../components/GoalsProvider'

export default function AddGoalPage() {
  const { addGoal, navigate } = useGoals()
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [monthly, setMonthly] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedTarget = Number(target)
    const parsedMonthly = Number(monthly)
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    if (target.trim().length === 0 || Number.isNaN(parsedTarget) || parsedTarget <= 0) {
      setError('Enter a positive target')
      return
    }
    const monthlyValue =
      monthly.trim().length === 0 || Number.isNaN(parsedMonthly) || parsedMonthly < 0
        ? 0
        : parsedMonthly
    setError('')
    addGoal({ name: name.trim(), target: parsedTarget, monthlyContribution: monthlyValue })
    setName('')
    setTarget('')
    setMonthly('')
    navigate('goals')
  }

  return (
    <section data-testid="page-add-goal">
      <h1>Add goal</h1>
      <form data-testid="goal-form" onSubmit={onSubmit}>
        <input
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          data-testid="target-input"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <input
          data-testid="monthly-input"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-goal">
          Add goal
        </button>
      </form>
    </section>
  )
}
