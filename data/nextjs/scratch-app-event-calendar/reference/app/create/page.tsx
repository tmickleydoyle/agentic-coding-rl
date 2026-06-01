'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { CATEGORIES, DAYS_IN_MONTH } from '../../lib/types'

export default function CreatePage() {
  const { addEvent, navigate } = useApp()
  const [title, setTitle] = useState('')
  const [day, setDay] = useState(1)
  const [category, setCategory] = useState(CATEGORIES[0] ?? '')
  const [error, setError] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0 || !Number.isInteger(day) || day < 1 || day > DAYS_IN_MONTH) {
      setError(true)
      return
    }
    setError(false)
    addEvent(title.trim(), day, category)
    navigate('month')
  }

  return (
    <section data-testid="page-create">
      <h1>Create Event</h1>
      <form data-testid="create-form" onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="day">Day</label>
        <input
          id="day"
          type="number"
          data-testid="day-input"
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
        />

        <label htmlFor="cat">Category</label>
        <select
          id="cat"
          data-testid="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {error ? <p data-testid="form-error">Title and a valid day are required.</p> : null}

        <button type="submit" data-testid="submit-create">
          Create
        </button>
      </form>
    </section>
  )
}
