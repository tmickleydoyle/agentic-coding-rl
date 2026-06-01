'use client'
import { useState } from 'react'
import { useHabits } from '../../components/HabitProvider'

export default function AddPage() {
  const { addHabit, navigate } = useHabits()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    addHabit(name)
    setName('')
    navigate('habits')
  }

  return (
    <section data-testid="page-add">
      <h1>Add Habit</h1>
      <form data-testid="add-form" onSubmit={onSubmit}>
        <input
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-habit">
          Add habit
        </button>
      </form>
    </section>
  )
}
