'use client'
import { useState } from 'react'
import { useGoals } from '../../components/GoalProvider'

export default function AddPage() {
  const { addGoal, navigate } = useGoals()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0 || date.trim().length === 0) {
      setError('Name and target date are required')
      return
    }
    setError('')
    addGoal({ name, targetDate: date })
    setName('')
    setDate('')
    navigate('goals')
  }

  return (
    <section data-testid="page-add">
      <h1>Add Goal</h1>
      <form data-testid="add-form" onSubmit={onSubmit}>
        <input
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          data-testid="date-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-goal">
          Add goal
        </button>
      </form>
    </section>
  )
}
