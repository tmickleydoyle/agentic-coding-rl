'use client'
import { useState } from 'react'
import { useEvents } from '../../components/AppStateProvider'
import { NOW } from '../../lib/types'

export default function CreatePage() {
  const { addEvent, navigate } = useEvents()
  const [title, setTitle] = useState('')
  const [day, setDay] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    const dayValue = day.trim().length > 0 ? Number(day) : NOW
    addEvent({ title: title.trim(), day: Number.isFinite(dayValue) ? dayValue : NOW })
    setTitle('')
    setDay('')
    navigate('events')
  }

  return (
    <section data-testid="page-create">
      <h1>Create event</h1>
      <form data-testid="event-form" onSubmit={onSubmit}>
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
          onChange={(e) => setDay(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-event">
          Add event
        </button>
      </form>
    </section>
  )
}
