'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function BookPage() {
  const { rooms, selectedRoomId, book, navigate } = useApp()
  const [title, setTitle] = useState('')
  const [start, setStart] = useState(10)
  const [end, setEnd] = useState(11)
  const [error, setError] = useState('')
  const [conflict, setConflict] = useState(false)

  const room = rooms.find((r) => r.id === selectedRoomId) ?? null

  if (!room) {
    return (
      <section data-testid="page-book">
        <h1>Book</h1>
        <p data-testid="no-room">Pick a room first.</p>
      </section>
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConflict(false)
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    const ok = book({ roomId: room.id, start, end, title: title.trim() })
    if (!ok) {
      setConflict(true)
      return
    }
    setTitle('')
    navigate('my-bookings')
  }

  return (
    <section data-testid="page-book">
      <h1>Book</h1>
      <p data-testid="selected-room">{room.name}</p>
      <form data-testid="booking-form" onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="start">Start</label>
        <input
          id="start"
          type="number"
          data-testid="start-input"
          value={start}
          onChange={(e) => setStart(Number(e.target.value))}
        />

        <label htmlFor="end">End</label>
        <input
          id="end"
          type="number"
          data-testid="end-input"
          value={end}
          onChange={(e) => setEnd(Number(e.target.value))}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}
        {conflict ? <p data-testid="conflict-error">That time is not available.</p> : null}

        <button type="submit" data-testid="submit-booking">
          Book room
        </button>
      </form>
    </section>
  )
}
