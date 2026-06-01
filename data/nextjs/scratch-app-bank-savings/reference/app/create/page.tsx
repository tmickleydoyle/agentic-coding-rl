'use client'
import { useState } from 'react'
import { useSavings } from '../../components/SavingsProvider'

export default function CreatePage() {
  const { createPot } = useSavings()
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(goal)
    if (name.trim().length === 0) {
      setError('Enter a name')
      return
    }
    if (goal.trim().length === 0 || Number.isNaN(parsed) || parsed < 0) {
      setError('Enter a valid goal')
      return
    }
    setError('')
    createPot({ name: name.trim(), goal: parsed })
  }

  return (
    <section data-testid="page-create">
      <h1>Create pot</h1>
      <form data-testid="pot-form" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="goal">Goal</label>
        <input
          id="goal"
          data-testid="goal-input"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-pot">
          Create pot
        </button>
      </form>
    </section>
  )
}
