'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function ReservePage() {
  const { tables, times, reserve, navigate } = useApp()
  const [name, setName] = useState('')
  const [tableId, setTableId] = useState(tables[0]?.id ?? '')
  const [time, setTime] = useState(times[0] ?? '')
  const [party, setParty] = useState(2)
  const [error, setError] = useState('')
  const [conflict, setConflict] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConflict(false)
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    const ok = reserve({ tableId, time, party, name: name.trim() })
    if (!ok) {
      setConflict(true)
      return
    }
    setName('')
    navigate('reservations')
  }

  return (
    <section data-testid="page-reserve">
      <h1>Reserve</h1>
      <form data-testid="reserve-form" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="table">Table</label>
        <select
          id="table"
          data-testid="table-select"
          value={tableId}
          onChange={(e) => setTableId(e.target.value)}
        >
          {tables.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <label htmlFor="time">Time</label>
        <select
          id="time"
          data-testid="time-select"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        >
          {times.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <label htmlFor="party">Party</label>
        <input
          id="party"
          type="number"
          data-testid="party-input"
          value={party}
          onChange={(e) => setParty(Number(e.target.value))}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}
        {conflict ? <p data-testid="conflict-error">That table is not available.</p> : null}

        <button type="submit" data-testid="submit-reserve">
          Reserve table
        </button>
      </form>
    </section>
  )
}
