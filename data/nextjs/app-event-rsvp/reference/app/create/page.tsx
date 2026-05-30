'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function CreatePage() {
  const { addEvent, navigate } = useApp()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError(true)
      return
    }
    setError(false)
    addEvent(name.trim(), date)
    navigate('events')
  }

  return (
    <section data-testid="page-create">
      <h1>Create Event</h1>
      <form data-testid="create-form" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="date">Date</label>
        <input
          id="date"
          data-testid="date-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {error ? <p data-testid="form-error">Name is required.</p> : null}

        <button type="submit" data-testid="submit-create">
          Create
        </button>
      </form>
    </section>
  )
}
